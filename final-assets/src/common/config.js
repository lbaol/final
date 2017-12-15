const domain = 'http://127.0.0.1:8080';


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


export {
    URL,Util
}