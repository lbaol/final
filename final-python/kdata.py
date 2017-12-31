from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
import tushare as ts
import time
print(ts.__version__)

Base = declarative_base()

engine = create_engine('mysql://root:hello@127.0.0.1/final?charset=utf8')

#df = ts.get_k_data('600000')
#df.to_sql('kdata_temp',engine,if_exists='replace')
DBSession = sessionmaker(bind=engine)

class Stock(Base):
    __tablename__ = 'stock'
    id = Column(Integer, primary_key=True)
    code = Column(String)
    name = Column(String)
    
session = DBSession()
rows = session.query(Stock).limit(50).all()
rowsLen = len(rows)

def fatchKData(code):
    print(code)
    df = ts.get_k_data(code)
    session.execute('delete from k_data where code = '+code)
    session.commit()
    df.to_sql('k_data',engine,if_exists='append',index_label='id')

start_time = time.time()
for r in rows:
    fatchKData(r.code)
print ('%d second'% (time.time()-start_time))

session.close()