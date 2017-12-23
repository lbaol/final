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
        downColor:'#ccc',
        width:'500px',
        height:'600px'
    }
}

const productConfig = {
    chart:{
        upColor:'#ec0000',
        downColor:'#00da3c',
        width:'100%',
        height:'600px'
    }
}

const Config = (Env=='daily')?dailyConfig:productConfig

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