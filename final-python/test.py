from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
import tushare as ts
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
rows = session.query(Stock).all()
for r in rows:
    print(r.code)
    df = ts.get_k_data(r.code)
    session.execute('delete from kdata_temp where code = '+r.code)
    session.commit()
    df.to_sql('kdata_temp',engine,if_exists='append',index_label='id')


session.close()