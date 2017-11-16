from sqlalchemy import create_engine
import tushare as ts
print(ts.__version__)

year = 2017
quarter = 2

engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')
with engine.connect() as con:
    con.execute(('delete from report_temp'))
df = ts.forecast_data(year,quarter)
df.to_sql('forecast_temp',engine)