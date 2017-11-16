from sqlalchemy import create_engine
import tushare as ts
print(ts.__version__)

year = 2017
month = 2

engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')
with engine.connect() as con:
    con.execute(('delete from report_'+str(year)))
    
df = ts.get_report_data(year,month)

df.to_sql(('report_'+str(year)),engine,if_exists='replace')

#追加数据到现有表
#df.to_sql('report_data',engine,if_exists='append')
#if_exists:如果表名已存在的处理方式 {‘fail’, ‘replace’, ‘append’},默认‘fail’