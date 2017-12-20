import React, {Component} from 'react';
// import Highcharts from 'highcharts/highstock';
// import 'highcharts/highcharts-more.js';
// import indicators from 'highcharts/indicators/indicators.js';

import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import {Radio,Checkbox} from 'antd';
import FEvents from "../FEvent/index.js";
import {request} from "../../common/ajax.js";
import {URL, Util,Config,Env} from "../../common/config.js";
import {defaultConfig} from "../../common/chartConfig.js";
import './index.scss';



Highcharts.setOptions(defaultConfig);


@FEvents
export default class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
			code:'',
            period:'day',
            startDate:'',
            endDate:'',
            chartData:{},
            baseInfo:{},
            dateMapper:{},
            maOptions:[
                { label: '10', value: 10 },
                { label: '30', value: 30 },
                { label: '50', value: 50 },
              ],
            maValue:[10,50]
        };
    }

    componentDidMount() {

        this.on('final:first-init', (data) => {
            this.emitRefresh(data)
        });
        
        this.on('final:show-the-stock', (data) => {
            this.emitRefresh(data)
        });
    }

    emitRefresh=(data)=>{
        console.log("data",data)
        const {code,period,startDate,endDate}  = this.state;
        this.setState({
            code:data.code?data.code:code,
            period:data.period?data.period:period,
            startDate:data.startDate?data.startDate:startDate,
            endDate:data.endDate?data.endDate:endDate
        },this.fatchChartData)
    }

    onPeriodChange=(e)=>{
        this.setState({
            period:e.target.value
        },this.fatchChartData)
    }
    
   

    fatchBaseInfo=()=>{
        const self = this;
        const {code} = this.state;
        request('/stock/getByCode',
		(res)=>{

            
            let eventList = res.eventList;

            eventList = _.orderBy(eventList, ['eventDate'], ['desc']);
            res.eventList = eventList;
            

			self.setState({
                baseInfo:res
            },self.renderChart)
		},{
            code:code
        },'jsonp')
    }

	fatchChartData(){
        const self = this;
        const {code,period,startDate,endDate}  = this.state;
        if(code){
            let newCode = code;
            if(_.startsWith(code,'6')){
                newCode = 'SH'+code;
            }else if(_.startsWith(code,'0') || _.startsWith(code,'3')){
                newCode = 'SZ'+code;
            }

            let m = period=='day'?365:700;
            let newStartDate = startDate ? moment(startDate) :moment().subtract(m, 'day');
            let newEndDate = endDate ? moment(endDate):moment()

            request('https://xueqiu.com/stock/forchartk/stocklist.json?type=before',
            (res)=>{

                let chartList = res.chartlist;
                let dateMapper =  {}
                for(let cha of chartList){
                    let date = moment(new Date(cha.timestamp)).format('YYYY-MM-DD');
                    cha.date = date;
                    dateMapper[date] = cha;
                }
                self.setState({
                    chartData:chartList,
                    dateMapper:dateMapper
                },self.fatchBaseInfo)


                
                
                
            },{
                symbol:newCode,
                period:'1'+period,
                begin:newStartDate.set('hour', 0).set('minute', 0).format('x'),
                end:newEndDate.set('hour', 23).set('minute', 59).format('x'),
            
            },'jsonp')
        }
    }

    getReportPriceByDate=(date)=>{
        let {chartData,dateMapper} = this.state;
        if(chartData){
            let cha = dateMapper[date];
            
            if(!cha){
                //如果没找到对应的日期，继续找
                cha = this.getWeekDateIndex(chartData,date)
            }

            if(cha){
                //如果找到对应的日期
                console.log('找到日期',cha.date,cha)
                return {
                    date:cha.date,
                    price:cha.high //取最高价
                }
            }
            
            
        }
        return null;
    }
    
    getWeekDateIndex=(chartData,date)=>{
        let i = 0;
        for( ; i<chartData.length;i++){
            if(chartData[i].date>=date){
                break;
            }
        }
        //如果找到i 小于 长度，则代表已经找到
        if(i<chartData.length-1){
            return chartData[i];
        }
        //如果找到的i 是 最后一位，则需要进一步比较date
        if(i==(chartData.length-1)){
            if(chartData[i].date>=date){
                return chartData[i];
            }
        }
        return null;
    }

    onMaSelectChange=(checkedValues)=>{
        this.setState({
            maValue:checkedValues
        },this.renderChart)
    }

    renderChart=()=>{

        
        let {chartData,baseInfo,code,maValue} = this.state;
        let ohlc = [];
        let volume = [];
        for(let d of chartData){
            ohlc.push([
                d.timestamp, // the date
                d.open, // open
                d.high, // high
                d.low, // low
                d.close // close
            ]);

            volume.push([
                d.timestamp, // the date
                d.lot_volume // the volume
            ]);
        }

        let eventList = baseInfo.eventList;
        let flagList = [];
        for(let ev of eventList){
            let datePrice = this.getReportPriceByDate(ev.eventDate);
            if(datePrice){
                let flagObj = {};
                if(ev.type == 'fault'){
                    let title = '断';
                    flagObj = {
                        x: (new Date(moment(datePrice.date))).getTime(),
                        title: title,
                        fillColor:'#f54545',
                        color:'red'
                    }
                }
                if(ev.type == 'report'){
                    let title = ev.quarter+'季度' + ev.profitsYoy+'%';
                    flagObj = {
                        x: (new Date(moment(datePrice.date))).getTime(),
                        title: title
                    }
                }
                if(ev.type == 'forecast'){
                    let title =  ev.quarter+'季度' + (_.includes(ev.ranges,'%')?ev.ranges:(ev.ranges+'%'))
                    flagObj = {
                        x: (new Date(moment(datePrice.date))).getTime(),
                        title: title,
                    }
                }
                flagList.push(flagObj)
            }
        }

        let maSeries = maValue.map((ma)=>{
            return {
                type: 'sma',
                linkedTo: 'dataseries',
                name: 'SMA'+ma,
                params: {
                    period: ma
                },
                marker: {
                    enabled: false
                }
            }
        })

        let initSeries =  [{
            type: 'candlestick',
            name: code,
            id: 'dataseries',
            data: ohlc,
            tooltip:{
                pointFormatter:function(){
                    return this.key+'<br/>'+
                    +this.series.name+'<br/>'
                    +'开盘：'+this.open+'<br/>'
                    +'最高：'+this.high+'<br/>'
                    +'最低：'+this.low+'<br/>'
                    +'收盘：'+this.close+'<br/>'
                    +'涨跌幅：'+_.floor((this.close-this.open)/this.open*100,2)+'%'
                }
            }
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1
        },{
            type: 'flags',
            onSeries: 'dataseries',
            shape: 'squarepin',
            data: flagList,
            y:-60,
            stackDistance:20
        }]
         

        initSeries = initSeries.concat(maSeries)

        // create the chart
        Highcharts.stockChart('main-chart-container', {
            
            rangeSelector: {
                selected: 0,
                inputEnabled:false,
                buttons: [{
                    type: 'month',
                    count: 11,
                    text: '11m'
                }, {
                    type: 'all',
                    text: 'All'
                }]
            },

            title: {
                text: ''
            },

            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'OHLC'
                },
                height: '70%',
                lineWidth: 1,
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top: '75%',
                height: '25%',
                offset: 0,
                lineWidth: 1
            }],
            scrollbar:{
                
            },
            tooltip: {
                split: true
            },

            series:initSeries
        });
    }
	

    render() {
        const {baseInfo,period,maOptions,maValue} = this.state;
        const basic = baseInfo.basic || {};

        return (
            <div className={'s-chart-wrap '+'s-chart-wrap-'+Env } style={{ width: Config.chart.width, height: Config.chart.height }}>
                <div>
                    <div className="o-h">
                        {basic.code} {basic.name} 
                        <span className="f-r">
                            <Radio.Group  onChange={this.onPeriodChange} defaultValue={period} size="small">
                                <Radio.Button value="day">日</Radio.Button>
                                <Radio.Button value="week">周</Radio.Button>
                            </Radio.Group>
                        </span>
                    </div>
                    <div>
                        <span>
                            <Checkbox.Group options={maOptions} defaultValue={maValue} onChange={this.onMaSelectChange} />

                        </span>
                    </div>
                    
                </div>
                <div className="mt10" id="main-chart-container">
            </div>
            </div>
        );
    }
}