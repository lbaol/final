from sqlalchemy import create_engine
import tushare as ts

print(ts.__version__)

engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')

year = 2017
quarter = 4


def fatchForecastData(year,quarter):
    df = ts.forecast_data(int(year),int(quarter))
    df.to_sql(('forecast_'+str(year)+'_'+str(quarter)),engine,if_exists='replace')


def fatchReportData(year,quarter):
    df = ts.get_report_data(int(year),int(quarter))
    df.to_sql(('report_'+str(year)+'_'+str(quarter)),engine,if_exists='replace')
    

def fatchStockBasics():
    df = ts.get_stock_basics()
    with engine.connect() as con:
        con.execute('delete from stock_temp')
    df.to_sql('stock_temp',engine,if_exists='append')

#fatchForecastData(year,quarter)
#fatchReportData(year,quarter)

