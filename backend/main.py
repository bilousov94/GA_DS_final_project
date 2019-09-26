from flask import Flask, Response, request, jsonify
from flask_restful import Resource, Api, reqparse
import yfinance as yf
import pandas as pd
import math
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io

from modules.prediction import Prediction

plt.rcParams['figure.figsize']=(16,8)
plt.style.use('ggplot')

app = Flask(__name__)
api = Api(app)

print('_____________________________________')
print('Loading list of all tickers.......')

data = pd.read_csv('./data/tickers.csv')

# Replace all Nan values and set indexes to all columns
ticker_list = data.fillna('Unavailable').set_index(['ticker', 'company', 'industry'])

print('_____________________________________')

class Search_tickers(Resource):
    def get(self):

        parser = reqparse.RequestParser()
        parser.add_argument('text', type=str)
        parser.add_argument('page', type=int)

        text_match = parser.parse_args().text
        page = parser.parse_args().page

        match_tickers = ticker_list.loc[(ticker_list.index.get_level_values('ticker').str.contains(pat=text_match, case=False)) |
                                        (ticker_list.index.get_level_values('company').str.contains(pat=text_match, case=False)) |
                                        (ticker_list.index.get_level_values('industry').str.contains(pat=text_match, case=False))
                ].sort_values('ticker').reset_index()

        numberOfResults = match_tickers.ticker.count()

        if(numberOfResults > 10):
            start = page*10
            ticker_left = match_tickers[start:(start+5)].to_dict(orient='records')
            ticker_right = match_tickers[(start+5):(start+10)].to_dict(orient='records')
            pagination = True
        
            if(math.ceil(numberOfResults/10) > 10):
                pages = 10
            else:
                pages = math.ceil(numberOfResults/10)
        else:          
            middle_number = math.ceil(numberOfResults/2)
            ticker_left = match_tickers[:middle_number].to_dict(orient='records')
            ticker_right = match_tickers[middle_number:10].to_dict(orient='records')
            pagination = False
            pages = 0

        # response_data = match_tickers.to_dict(orient='records')

        return jsonify({ 'tickers_left': ticker_left, 'tickers_right': ticker_right, 
                         'pagination': pagination, 'pages':  pages,
                         'search_text': text_match})

class Stock_data(Resource):
    def get(self, ticker):
        stock = yf.Ticker(ticker)
        if len(stock.info):
            history = stock.history(period='max')
            max_year = history.tail(1).reset_index()['Date'].astype(str)[0]
            max_year = int(max_year[:4]) + 1

            min_year = history.head(1).reset_index()['Date'].astype(str)[0]
            min_year = int(min_year[:4])

            company_info = stock.info
            return jsonify({ 'max_year': max_year, 'min_year': min_year, 'data': company_info})
        else:    
            return jsonify({ 'max_year': False, 'min_year': False, 'data': False })


class Predict(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('ticker', type=str)
        parser.add_argument('start_date', type=str)
        parser.add_argument('end_date', type=str)

        ticker = parser.parse_args().ticker
        start_date = parser.parse_args().start_date
        end_date = parser.parse_args().end_date

        company = Prediction(ticker, start_date, end_date)

        plot = Prediction.prophet_test(company)   
        
        #render plot as an image
        output = io.BytesIO()
        FigureCanvas(plot).print_png(output)
        return Response(output.getvalue(), mimetype='image/png')
        

api.add_resource(Stock_data, '/<string:ticker>')
api.add_resource(Search_tickers, '/search')
api.add_resource(Predict, '/prediction')  
 
if __name__ == '__main__':
    app.run(debug=True, port=8080)    