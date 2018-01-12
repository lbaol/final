from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric
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

class KData(Base):
    __tablename__ = 'k_data'
    id = Column(Integer, primary_key=True)
    code = Column(String)
    date = Column(String)
    open = Column(Numeric)
    close = Column(Numeric)
    high = Column(Numeric)
    low = Column(Numeric)
    
session = DBSession()
stockRows = session.query(Stock).limit(2).all()
stockRowsLen = len(stockRows)

def fatchAllKData(code):
    df = ts.get_k_data(code)
    session.execute('delete from k_data where code = '+code)
    session.commit()
    df.to_sql('k_data',engine,if_exists='append',index_label='id')

def fatchKDataByDate(kData):
    df2 = ts.get_k_data(kData.code,ktype='D',autype='qfq',index=False,start=kData.date)
    lastKData = df2.values[0]
    if lastKData.open == kData.open and lastKData.close == kData.close:
        session.execute('delete from k_data where code = '+kData.code +'and date = '+kData.date)
        session.commit()
        df2.to_sql('k_data',engine,if_exists='append',index_label='id')
    else:
        fatchAllKData(kData.code)

def fatchLastData(code):
    row = session.query(KData).filter(KData.code==code).order_by(KData.date.desc()).limit(1).all()
    if(row and row[0]):
        fatchKDataByDate(row[0])

fatchLastData('600025')

start_time = time.time()
for s in stockRows:
    #print('剩余：'+str(stockRowsLen))
    #fatchLastData(s.code)
    stockRowsLen = stockRowsLen-1
print ('%d second'% (time.time()-start_time))

session.close()