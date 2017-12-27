from sqlalchemy import create_engine
import tushare as ts

print(ts.__version__)

engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')

year = 2017
quarter = 1




def fatchForecastData(year,quarter):
    df = ts.forecast_data(year,quarter)
    df.to_sql(('forecast_'+str(year)+'_'+str(quarter)),engine,if_exists='replace',index=False,flavor='mysql')


#fatchForecastData(year,quarter)