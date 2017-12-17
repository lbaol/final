from sqlalchemy import create_engine
import tushare as ts
print(ts.__version__)

year = 2017
quarter = 3


    
df = ts.get_report_data(year,quarter)
engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')
df.to_sql(('report_'+str(year)+'_'+str(quarter)),engine,if_exists='replace')
#df.to_excel('c:/report1.xlsx')

#with engine.connect() as con:
#    con.execute(('delete from report_'+str(year)))

#追加数据到现有表
#df.to_sql('report_data',engine,if_exists='append')
#if_exists:如果表名已存在的处理方式 {‘fail’, ‘replace’, ‘append’},默认‘fail’