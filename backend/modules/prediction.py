import yfinance as yf
import numpy as np
import pandas as pd
from fbprophet import Prophet
import matplotlib.pyplot as plt

from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from pandas.tseries.offsets import BDay


class Prediction():
    def __init__(self, ticker, start_date, end_date):
        self.ticker = ticker
        self.start = start_date
        self.end = end_date
        

    def prophet_test(self):
        stock = yf.Ticker(self.ticker)
        data = stock.history(period='max').drop(columns=['Open', 'High', 'Low', 'Volume', 'Dividends', 'Stock Splits'])

        # Data, based on which we will make a prediction (Train data)
        train_data = data[(data.index >= self.start) & (data.index < self.end)]

        #Our test data, to compare in the end results
        test_data = data[data.index > self.end]

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
        ax1.set_title(f'Actual {self.ticker} Close Data vs Forecasted (Black) with Confidence Bands')
        ax1.set_ylabel('Price')
        ax1.set_xlabel('Date')

        L=ax1.legend() #get the legend
        L.get_texts()[0].set_text('Train Data')
        L.get_texts()[1].set_text('Test Data')#change the legend text for 1st plot
        L.get_texts()[2].set_text('Forecasted') #change the legend text for 2nd plot
       
        textstr = f" MSE: {mse}\n r2: {r2}\n MAE: {mae}"
        plt.text(0.01, 0.5, textstr, fontsize=20, transform=plt.gcf().transFigure)

        fig.subplots_adjust(bottom=0.1, top=0.91, left=0.17, right=0.96)

        return fig