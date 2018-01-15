from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric
import tushare as ts
import time
print(ts.__version__)
SQLALCHEMY_ECHO=True

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
stockRows = session.query(Stock).all()
stockRowsLen = len(stockRows)

def fatchAllKData(code):
    print(str(code)+'：准备获取所有数据')
    df = ts.get_k_data(code)
    session.execute('delete from k_data where code = '+code)
    session.commit()
    df.to_sql('k_data',engine,if_exists='append',index_label='id')

def fatchKDataByDate(kData):
    
    df2 = ts.get_k_data(kData.code,ktype='D',autype='qfq',index=False,start=kData.date)
    print(str(kData.code)+"：获取从"+str(kData.date)+'开始的数据，'+str(len(df2))+'条')
    if(len(df2)>0):
        lastKData = df2.values[0]
        if lastKData[0] == kData.date and lastKData[1] == kData.open and lastKData[2] == kData.close:
            if len(df2.values)>1:
                print(str(kData.code)+'：++增量更新')
                session.execute('delete from k_data where code = '+str(kData.code) +' and date = "'+str(kData.date)+'"')
                session.commit()
                df2.to_sql('k_data',engine,if_exists='append',index_label='id')
            else:
                print(str(kData.code)+'：!!无须更新')
        else:
            fatchAllKData(kData.code)
    


def fatchLastData(code):
    print(str(code)+'：start 开始处理')
    rows =  session.query(KData).filter(KData.code==code).order_by(KData.date.desc()).limit(1).all()
    if(rows and rows[0]):
        fatchKDataByDate(rows[0])
    else:
        fatchAllKData(code)
    print(str(code)+'：end 结束处理')


start_time = time.time()
for s in stockRows:
    print('剩余：'+str(stockRowsLen))
    fatchLastData(s.code)
    stockRowsLen = stockRowsLen-1
print ('%d second'% (time.time()-start_time))

session.close()