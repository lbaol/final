import React from 'react';
import _ from 'lodash';
const domain = 'http://127.0.0.1:8080';
const Env = 'product' //daily product
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

        if(path.indexOf('/python/') >=0){
            return pythonDomain + path;
        }
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
    },
    getLastMa:function(datas,count){
        if(_.isArray(datas)){
            if(datas.length >= count){
                let total = 0 ;
                for(let i = datas.length-1;i>=(datas.length-count);i--){
                    total = datas[i].close + total;
                }
                return _.round(total/count,2);
            }
        }
        return null;
    },
    getXueQiuStockLink:function(code){
        return <a target="_blank" href={'https://xueqiu.com/S/'+Util.getFullCode(code)}>雪</a>
    },
    getDongCaiStockLink:function(code){
        return <a target="_blank" href={'http://emweb.securities.eastmoney.com/f10_v2/OperationsRequired.aspx?type=web&code='+Util.getFullCode(code)}>东</a>
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
        { label: '关注', value: 'follow' },
        { label: '备选池', value: 'prepare' },
        { label: '持仓', value: 'position' },
        { label: '杯柄', value: 'handle' },
        { label: '断层', value: 'fault' },
        { label: '领先新高', value: 'leadNewHigh' },
        { label: '默认', value: 'default' },
        { label: '临时', value: 'temp' },
        { label: '监控', value: 'monitor' },
        { label: '金股18', value: 'gold18' }
    ],
    eventType: [
        { label: '断层', value: 'fault' },
        { label: '杯柄', value: 'handle' },
        { label: '领先新高', value: 'leadNewHigh' }
    ],
    noteType: [
        { label: '概要', value: 'summary' },
        { label: '按日期', value: 'date' },
        { label: '总体', value: 'overall' }
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
    URL,Util,Config,Env,Dict
}