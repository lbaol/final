from bottle import route, request,hook, run, response,template
import fatch_data as fd



def allow_cross_domain(fn):  
    def _enable_cors(*args, **kwargs):  
        #set cross headers  
        response.headers['Access-Control-Allow-Origin'] = '*'  
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,OPTIONS'  
        allow_headers = 'Referer, Accept, Origin, User-Agent'  
        response.headers['Access-Control-Allow-Headers'] = allow_headers       
        if request.method != 'OPTIONS':  
            # actual request; reply with the actual response  
            return fn(*args, **kwargs)      
    return _enable_cors  

@route('/python/test')
@allow_cross_domain
def index():
    return {'isSuccess':True}

@route('/helloworld/:yourwords', methods=['GET', 'POST'])  
@allow_cross_domain
def hello(yourwords):  
    return 'hello world. ' + yourwords  

@route('/fatch/basics')
def baiscs():
    print('start fatch basic')
    fd.fatchStockBasics()
    print('end fatch basic')
    return {'isSuccess':True}

@route('/fatch/report')
def display_forum():
    year = request.query.year
    quarter = request.query.quarter
    reportType =  request.query.reportType
    if(year is None or quarter is None or reportType is None):
        return {'isSuccess':False}
    if(reportType == 'report'):
        fd.fatchReportData(year,quarter)
    elif (reportType == 'forecast'):
        fd.fatchForecastData(year,quarter)

run(host='localhost', port=8001)