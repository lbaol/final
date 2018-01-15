from sqlalchemy import create_engine
import tushare as ts
print(ts.__version__)

df = ts.get_stock_basics()
engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')
with engine.connect() as con:
    con.execute('delete from stock')
df.to_sql('stock',engine,if_exists='append')