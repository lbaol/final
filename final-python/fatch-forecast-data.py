from sqlalchemy import create_engine
import tushare as ts
print(ts.__version__)

df = ts.forecast_data(2017,3)
engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')
df.to_sql('forecast',engine)