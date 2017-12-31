import tushare as ts
print(ts.__version__)

df = ts.get_k_data("600000")
df.to_excel('c:/test.xlsx')