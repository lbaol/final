from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
import tushare as ts
import time
import threadpool  

print(ts.__version__)

Base = declarative_base()

engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8',pool_size=100)

#df = ts.get_k_data('600000')
#df.to_sql('kdata_temp',engine,if_exists='replace')
DBSession = sessionmaker(bind=engine)

class Stock(Base):
    __tablename__ = 'stock'
    id = Column(Integer, primary_key=True)
    code = Column(String)
    name = Column(String)
    
session = DBSession()
rows = session.query(Stock).all()
rowsLen = len(rows)
session.close()


def fatchKData(r):
    print('start : ' + r.code)
    session = DBSession()
    session.execute('delete from k_data where code = '+r.code)
    session.commit()
    session.close()
    df = ts.get_k_data(r.code)
    df.to_sql('k_data',engine,if_exists='append',index_label='id')
    print('end : ' +r.code)

start_time = time.time()
pool = threadpool.ThreadPool(10) 
requests = threadpool.makeRequests(fatchKData, rows) 
[pool.putRequest(req) for req in requests] 
pool.wait() 
print ('%d second'% (time.time()-start_time))


