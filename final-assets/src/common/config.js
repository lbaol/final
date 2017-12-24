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
    },
    getFullCode:function(code){
        let newCode = code;
        if (_.startsWith(code, '6')) {
            newCode = 'SH' + code;
        } else if (_.startsWith(code, '0') || _.startsWith(code, '3')) {
            newCode = 'SZ' + code;
        }
        return newCode;
    }
}

let Config = {
    defalutMas:{
        day : [10,20,50,120],
        week: [10,30,50]
    },
    defaultPeriod:{
        day:365,
        week:700
    }
}

if(Env=='product'){
    Config.chart = {
        upColor:'#ec0000',
        downColor:'#00da3c',
        width:'100%',
        height:'600px'
    }
}
if(Env=='daily'){
    Config.chart = {
        upColor:'#f5f5f5',
        downColor:'#ccc',
        width:'500px',
        height:'600px'
    }
}



let Dict = {
    favType : [
        { label: '备选', value: 'prepare' },
        { label: '股票池', value: 'pool' },
        { label: '持仓', value: 'position' },
        { label: '杯柄', value: 'handle' },
        { label: '断层', value: 'fault' },
        { label: '领先新高', value: 'leadNewHigh' },
        { label: '默认', value: 'default' }
    ],
    eventType: [
        { label: '断层', value: 'fault' },
        { label: '杯柄', value: 'handle' },
        { label: '领先新高', value: 'leadNewHigh' }
    ]
}



for(let key in Dict){
    let mapperKey = key+'Mapper';
    Dict[mapperKey] = {}
    for(let d of Dict[key]){
        Dict[mapperKey][d.value] = d.label
    }
}

export {
    URL,Util,Config,Env,Dict
}