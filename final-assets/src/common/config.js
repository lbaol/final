import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { request,request_sync} from "common/ajax.js";
import FEvents from "components/Common/FEvent/index.js";

const Env = 'product' //daily product




let Config = {
    defalutMas:{
        day : [10,20,50,120,250],
        week: [10,30,50]
    },
    defaultPeriod:{
        day:1000,
        week:1000
    },
    indexPeakValley:[{
        start:'2017-11-29',
        end:'2018-01-15'
    }],
    quote:{
        doInterval:false,
        intervalTime:5000
    },
    defaultChart:{
        startDate:moment().subtract(1000, 'day').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    },
    indexPeriods:[],
    cash:{
        stock:0,
        futures:0
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
        height:'400px'
    }
}



let Dict = {
    favType : [
        { label: '关注', value: 'follow' },
        { label: '备选池', value: 'prepare' },
        { label: '持仓', value: 'position' },
        // { label: '杯柄', value: 'handle' },
        // { label: '断层', value: 'fault' },
        // { label: '领先新高', value: 'leadNewHigh' },
        // { label: '默认', value: 'default' },
        { label: '临时', value: 'temp' },
        { label: '监控', value: 'monitor' },
        { label: '金股18', value: 'gold18' }
    ],
    eventType: [
        { label: '断层', value: 'fault' },
        { label: '杯柄', value: 'handle' },
        { label: '领先新高', value: 'leadNewHigh' },
        { label: '突破', value: 'breakThrough' }
    ],
    noteType: [
        { label: '概要', value: 'summary' },
        { label: '按日期', value: 'date' },
        { label: '总文档', value: 'overall' }
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
    ],
    exchangeType:[
        {label:'沪市',value:'SH'},
        {label:'深市',value:'ZH'},
    ],
    indexType:[
        {label:'上证50',value:'SH000016'},
        {label:'沪深300',value:'SZ399300'},
        {label:'中证500',value:'SH000905'}
    ],
    marketType:[
        {label:'大陆A股',value:'a'},
        {label:'港股',value:'hk'},
        {label:'美股',value:'us'},
    ],
    recordDirection:[
        {label:'多',value:'long'},
        {label:'空',value:'short'}
    ],
    recordOper:[
        {label:'买入',value:'buy'},
        {label:'卖出',value:'sell'},
    ],
    recordSubOper:[
        {label:'开仓',value:'open'},
        {label:'平仓',value:'close'}
    ],
    recordType:[
        {label:'股票',value:'stock'},
        {label:'期货',value:'futures'},
    ],
    recordOpenSignal:[
        {label:'平台突破',value:'platform'}, //平台
        {label:'口袋支点',value:'pivot'}, //口袋支点
        {label:'杯柄',value:'handle'}, //杯柄
        {label:'VCP',value:'vcp'}, //VCP
        {label:'基底突破',value:'base'}, //VCP
        {label:'上涨趋势中',value:'rising'},
        {label:'其他',value:'other'},
    ],
    recordOpenType:[
        {label:'10日线-首次',value:'fm10'},
        {label:'20日线-首次',value:'fm20'},
        {label:'50日线-首次',value:'fm50'},
        {label:'120日线-首次',value:'fm120'},
        {label:'10日线-非',value:'m10'},
        {label:'20日线-非',value:'m20'},
        {label:'50日线-非',value:'m50'},
        {label:'120日线-非',value:'m120'},
        {label:'突破日',value:'break'},
        {label:'其他',value:'other'},
    ],
    recordGroupStatus:[
        {label:'交易中',value:'trade'},
        {label:'结束',value:'finish'}
    ],
    recordGroupStatus:[
        {label:'交易中',value:'trade'},
        {label:'结束',value:'finish'}
    ],
    recordStatStatus:[
        {label:'正常',value:''},
        {label:'忽略',value:'ignore'}]
}




for(let key in Dict){
    let mapperKey = key+'Mapper';
    Dict[mapperKey] = {}
    for(let d of Dict[key]){
        Dict[mapperKey][d.value] = d.label
    }
}


let stockQuoteCodes = [];
let futuresQuoteCodes=[];
let Data = {
    stock : {},
    stockQuote : {},
    futuresQuote: {},
    addCodesToStockQuote:(codeArray)=>{
        let codes = [].concat(stockQuoteCodes,codeArray);
        codes = _.sortedUniq(codes);
        stockQuoteCodes = codes;
    },
    addCodesToFuturesQuote:(codeArray)=>{
        let codes = [].concat(futuresQuoteCodes,codeArray);
        codes = _.sortedUniq(codes);
        futuresQuoteCodes = codes;
    },
    getStockQuote:(code)=>{
        return Data.stockQuote[Util.getFullCode(code)]
    },
    getFuturesQuote:(code)=>{
        return Data.futuresQuote[code]
    }
};

//获取股票基本信息
function fetchStockDict(){
    console.log('fetchStockDict start');
    request_sync('/stock/getAll',
    (res)=>{
        
        let stockDict = {}
        for(let st of res){
            stockDict[st.code] = st
        }
        Dict.stockDict = stockDict;
        Data.stock = stockDict;
        console.log('fetchStockDict end',Dict.stockDict);
    })
}

function fetchIndexPeriods(){
    console.log('fetchIndexPeriods start');
    request_sync('/indexPeriod/getAll',
    (res)=>{
        Config.indexPeriods = res.list
        console.log('fetchIndexPeriods end',Config)
    })
}

fetchStockDict();
fetchIndexPeriods();


const Util = {
    getFullCode:function(code){
        let newCode = code;
        if (_.startsWith(code, '6')) {
            newCode = 'SH' + code;
        } else if (_.startsWith(code, '0') || _.startsWith(code, '3')) {
            newCode = 'SZ' + code;
        }
        return newCode;
    },
    getStockName:function(code){
        if(Dict.stockDict[code]){
            return Dict.stockDict[code].name
        }
        if(Dict.indexTypeMapper[code]){
            return Dict.indexTypeMapper[code]
        }
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
    },
    getWeekDateIndex : function(chartData, date){
        let i = 0;
        for (; i < chartData.length; i++) {
            if (chartData[i].date >= date) {
                break;
            }
        }
        //如果找到i 小于 长度，则代表已经找到
        if (i < chartData.length - 1) {
            return chartData[i];
        }
        //如果找到的i 是 最后一位，则需要进一步比较date
        if (i == (chartData.length - 1)) {
            if (chartData[i].date >= date) {
                return chartData[i];
            }
        }
        return null;
    },
    //根据日期找K线上对应的日期
    getKDateByEventDate :function(date,chartData,dateMapper){
        if (chartData) {
            let cha = dateMapper[date];

            if (!cha) {
                //如果没找到对应的日期，继续找
                cha = Util.getWeekDateIndex(chartData, date)
            }

            if (cha) {
                //如果找到对应的日期
                console.log('找到日期', cha.date, cha)
                return {
                    date: cha.date,
                    price: cha.high //取最高价
                }
            }
        }
        return null;
    },
    renderRise:function(d){
        if(d && _.isNumber(_.toNumber(d))){
            let d2 = _.toNumber(d);
            if(d2>0){
                return <span style={{color:'red'}}>{d}</span>
            }else{
                return <span style={{color:'green'}}>{d}</span>
            }
        }
    },
    renderRisePercent:function(d){
        return d && <span>{Util.renderRise(d)}%</span>
    }
}

//获取股票实时行情
function getLastStockQuote(){
    if(Config.quote.doInterval == true){
        let codes = stockQuoteCodes;
        if(codes.length > 0 ){
            let reqCodes = codes.map(d => Util.getFullCode(d));
            request('https://xueqiu.com/v4/stock/quote.json',
                (res) => {

                    let quote = {};
                    for (let k in res) {
                        quote[k] = res[k]
                    }
                    Data.stockQuote = quote;
                    FEvents.emit('final:stock-quote-refresh-finish');
                }, {
                    code: reqCodes.join(',')
                }, 'jsonp')
        }
    }
}

//获取期货实时行情
function getLastFuturesQuote(){
    if(Config.quote.doInterval == true){
        let codes = futuresQuoteCodes;
        if(codes.length > 0 ){
            let reqCodes = codes.map(d => 'FU_'+d);
            request('http://api.money.126.net/data/feed/'+reqCodes.join(',')+',money.api',
                (res) => {
                    let quote = {};
                    for(let k in res){
                        let d = res[k];
                        quote[d.symbol] = {
                            current:d.price,
                            percentage:_.round(d.percent*100,2)
                        }
                    }
                    Data.futuresQuote = quote;
                    FEvents.emit('final:futures-quote-refresh-finish');
                }, {
                    
                }, 'jsonp','','','_ntes_quote_callback')
        }
    }
}

setInterval(()=>{
    getLastStockQuote();
    getLastFuturesQuote();
}, Config.quote.intervalTime)


export {
    URL,Util,Config,Env,Dict,Data
}