const domain = 'http://127.0.0.1:8080';
const Env = 'product' //daily product

const URL = {
    forecast:{
        getAll:'/forecast/getAll'
    },
    report:{
        getAll:'/report/getAll'
    }
}

const Util = {
    getUrl:function(path){
      if (path.startsWith("http"))
        return path;
      return domain + path;
    }
}

const dailyConfig = {
    chart:{
        upColor:'#f5f5f5',
        downColor:'#ccc'
    }
}

const productConfig = {
    chart:{
        upColor:'#ec0000',
        downColor:'#00da3c'
    }
}

const Config = (Env=='daily')?dailyConfig:productConfig


export {
    URL,Util,Config,Env
}