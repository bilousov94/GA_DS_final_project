from flask import Flask, Response, request, jsonify
from flask_restful import Resource, Api

import yfinance as yf
import numpy as np
import pandas as pd
import math
import matplotlib.pyplot as plt
from pandas.tseries.offsets import BDay
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io
import random
from fbprophet import Prophet
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from pandas.tseries.offsets import BDay

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
    def get(self, text_match):
        match_tickers = ticker_list.loc[(ticker_list.index.get_level_values('ticker').str.contains(pat=text_match, case=False)) |
                                        (ticker_list.index.get_level_values('company').str.contains(pat=text_match, case=False)) |
                                        (ticker_list.index.get_level_values('industry').str.contains(pat=text_match, case=False))
                ].reset_index()

        numberOfResults = match_tickers.ticker.count()

        if(numberOfResults > 10):
            ticker_left = match_tickers[:5].to_dict(orient='records')
            ticker_right = match_tickers[5:10].to_dict(orient='records')
            pagination = True
            pages = math.floor(numberOfResults/10)
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
        stock_info = yf.Ticker(ticker).info
        if(len(stock_info)):
            return jsonify({ ticker: stock_info})
        else:    
            return jsonify({ 'error': 'Ticker not exists or data currently unavailable'})
        
        
    
    def post(self):
        some_json = request.get_json()
        return { 'you sent': some_json }, 201


class TestPrediction(Resource):
    def get(self, ticker):
        stock = yf.Ticker(ticker)
        data = stock.history(period='max').drop(columns=['Open', 'High', 'Low', 'Volume', 'Dividends', 'Stock Splits'])

        trade_days = data.Close.count()

        # Data, based on which we will make a prediction (Train data)
        train_data = data.iloc[:(trade_days - 260)]

        #Our test data, to compare in the end results
        test_data = data.iloc[(trade_days - 260):]

        # Format train data in Prophet standards
        prophet_data = train_data.reset_index().rename(columns={'Date': 'ds','Close': 'y'})

        #Initialize prophit object
        pr = Prophet()

        pr.fit(prophet_data)

        #create future dataframe for 380 days
        future = pr.make_future_dataframe(periods=380)

        # Pandas function to remove all non business days from future df
        isBusinessDay = BDay().onOffset

        # Create a final future df without weekends
        future_boolean = future['ds'].map(isBusinessDay)
        future = future[future_boolean] 

        #Make a prediction
        forecast = pr.predict(future)

        all_data = forecast.set_index('ds').join(train_data)

        # Data for caclulating r2_score, mean_square_error, mean_absolute_error
        all_data_drop_na = all_data.dropna()

        # r2 score
        r2 = round(r2_score(all_data_drop_na.Close, all_data_drop_na.yhat), 3)

        # mean square error
        mse = round(mean_squared_error(all_data_drop_na.Close, all_data_drop_na.yhat), 3)

        #mean absolute error
        mae = round(mean_absolute_error(all_data_drop_na.Close, all_data_drop_na.yhat), 3)

        #_train_data = all_data.reset_index().to_dict(orient='records')
        #response_test_data =  test_data.reset_index().to_dict(orient='records')

        #Creating plot
        fig, ax1= plt.subplots()
        ax1.plot(all_data.Close, color='darkblue')
        ax1.plot(test_data.Close, color='red')
        ax1.plot(all_data.yhat, color='black', linestyle=':')
        ax1.fill_between(all_data.index, all_data['yhat_upper'], all_data['yhat_lower'], alpha=0.5, color='darkgray')
        ax1.set_title(f'Actual {ticker} Close Data vs Forecasted (Black) with Confidence Bands')
        ax1.set_ylabel('Price')
        ax1.set_xlabel('Date')

        L=ax1.legend() #get the legend
        L.get_texts()[0].set_text('Train Data')
        L.get_texts()[1].set_text('Test Data')#change the legend text for 1st plot
        L.get_texts()[2].set_text('Forecasted') #change the legend text for 2nd plot
       
        textstr = f" MSE: {mse}\n r2: {r2}\n MAE: {mae}"
        plt.text(0.01, 0.5, textstr, fontsize=20, transform=plt.gcf().transFigure)

        fig.subplots_adjust(bottom=0.1, top=0.91, left=0.17, right=0.96)

        #render plot as an image
        output = io.BytesIO()
        FigureCanvas(fig).print_png(output)
        return Response(output.getvalue(), mimetype='image/png')



api.add_resource(Stock_data, '/<string:ticker>')
api.add_resource(Search_tickers, '/search_tickers/<string:text_match>')
api.add_resource(TestPrediction, '/test_prediction/<string:ticker>')                

if __name__ == '__main__':
    app.run(debug=True, port=8080)    