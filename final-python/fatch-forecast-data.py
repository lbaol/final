from sqlalchemy import create_engine
import tushare as ts
print(ts.__version__)

year = 2017
quarter = 4

engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')

df = ts.forecast_data(year,quarter)
#with engine.connect() as con:
#    con.execute(('delete from forecast_temp'))
#df.to_sql(('forecast_'+str(year)+'_'+str(quarter)),engine,if_exists='replace',index=False,flavor='mysql')
print (df)