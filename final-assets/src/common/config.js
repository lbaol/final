const domain = 'http://127.0.0.1:8080';
const Env = 'daily' //daily product
const pythonDomain = 'http://127.0.0.1:8001';

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
        upColor:'red',
        downColor:'limegreen',
        width:'100%',
        height:'600px'
    }
}
if(Env=='daily'){
    Config.chart = {
        upColor:'#a2d2ff',
        downColor:'#f5f5f5',
        width:'100%',
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
    ],
    noteType: [
        { label: '概要', value: 'summary' },
        { label: '按日期', value: 'date' }
    ],
    yearType: [
        { label: '2017', value: '2017' },
        { label: '2016', value: '2016' }
    ],
    quarterType: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' }
    ],
    reportType: [
        { label: '报告', value: 'report' },
        { label: '预告', value: 'forecast' }
    ]
}



for(let key in Dict){
    let mapperKey = key+'Mapper';
    Dict[mapperKey] = {}
    for(let d of Dict[key]){
        Dict[mapperKey][d.value] = d.label
    }
}

const Domain = {
    domain:domain,
    python:pythonDomain
}

export {
    URL,Util,Config,Env,Dict,Domain
}