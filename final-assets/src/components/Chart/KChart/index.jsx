import React, { Component } from 'react';
// import Highcharts from 'highcharts/highstock';
// import 'highcharts/highcharts-more.js';
// import indicators from 'highcharts/indicators/indicators.js';

import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import { Radio, Checkbox } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import { request } from "common/ajax.js";
import { URL, Util, Config, Env,Dict } from "common/config.js";
import { defaultConfig } from "common/chartConfig.js";



Highcharts.setOptions(defaultConfig);

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mas:props.mas,
            chartData:props.chartData,
            code:props.code,
            eventList:[],
            noEvent:props.noEvent == true ? true:false,
            dateMapper: {},
            hasEventChecked:false
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.initData();
    }


    initData=()=>{
        let {code,chartData} = this.state;
        if(!code || !_.isArray(chartData) || chartData.length<=0){
            return;
        }
        let dateMapper = {}
        for (let i in chartData) {
            chartData[i].index = _.toNumber(i);
            dateMapper[chartData[i].date] = chartData[i];
        }
        this.setState({
            dateMapper:dateMapper,
            chartData:chartData,
            hasEventChecked:false
        },this.fatchEventList)
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.chartData, this.props.chartData)){
            this.setState({
                ...nextProps
            },this.initData)
            
        }
    }



    fatchEventList = () => {
        const self = this;
        const { code,hasEventChecked } = this.state;
        request('/event/getByCode',
            (res) => {


                let eventList = res.eventList;

                eventList = _.orderBy(eventList, ['eventDate'], ['desc']);
                


                self.setState({
                    eventList: eventList
                }, ()=>{
                    this.renderChart();
                    if(hasEventChecked == false){
                        this.checkEvents();
                    }
                    
                })
            }, {
                code: code
            }, 'jsonp')
    }

  

   
    //根据日期找K线上对应的日期
    getKDateByEventDate = (date) => {
        let {dateMapper,chartData} = this.state;
        if (chartData) {
            let cha = dateMapper[date];

            if (!cha) {
                //如果没找到对应的日期，继续找
                cha = this.getWeekDateIndex(chartData, date)
            }

            if (cha) {
                //如果找到对应的日期
                // console.log('找到日期', cha.date, cha)
                return {
                    date: cha.date,
                    price: cha.high, //取最高价
                    index: cha.index
                }
            }


        }
        return null;
    }

    getWeekDateIndex = (chartData, date) => {
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
    }

    checkEvents=()=>{
        let {noEvent} = this.state;
        if(noEvent == true){
            return;
        }
        
        this.checkFaultEvents()
        this.checkLeadNewHighEvents();
        this.setState({
            hasEventChecked:true
        },this.fatchEventList)
        
        
    }

    //检查是否有利润断层
    checkFaultEvents=()=>{
        let {eventList,chartData,dateMapper} = this.state;
        let eventDateList = [];
        for(let event of eventList){
            if(event.type == 'report' || event.type == 'forecast'){
                let kData = this.getKDateByEventDate(event.eventDate);
                if(kData){
                    if(chartData[kData.index-1] && chartData[kData.index]){
                        let before = chartData[kData.index-1];
                        let after = chartData[kData.index];
                        if((after.close/before.close)>1.07 && (after.open > before.close) && kData.index!=0){
                            console.log('找到利润断层：',kData.date,'后一天收盘：',after.close,'前一天收盘：',before.close,'涨幅：',(after.close/before.close-1)*100)
                            if(_.findIndex(eventList,{eventDate:kData.date,type:'fault'})==-1){
                                eventDateList.push(kData.date);
                            }
                            
                            continue;
                        }
                    }
                    if(chartData[kData.index] && chartData[kData.index+1]){
                        let before = chartData[kData.index];
                        let after = chartData[kData.index+1];
                        if((after.close/before.close)>1.07 && (after.open > before.close) && kData.index!=0){
                            console.log('找到利润断层：',kData.date,'后一天收盘：',after.close,'前一天收盘：',before.close,'涨幅：',(after.close/before.close-1)*100)
                            if(_.findIndex(eventList,{eventDate:kData.date,type:'fault'})==-1){
                                eventDateList.push(kData.date);
                            }
                            continue;
                        }
                    }
                }
            }
        }
        if(eventDateList.length > 0 ){
            eventDateList = _.sortedUniq(eventDateList);
            for(let date of eventDateList){
                this.addOrUpdateEventByDateAndType(date,'fault');
            }
            
        }
    }

    //检查是否有提前大盘新高
    checkLeadNewHighEvents=()=>{
        let {chartData,dateMapper,eventList} = this.state;
        let startDate = '2017-11-29';
        let endDate = '2018-01-03';
       
        let dayCount = 250;
        if(chartData.length<120){
            return
        }
        if(chartData.length<250){
            dayCount = 120;
        }
        //计算历史新高从startDate开始
        let newStartKData = this.getKDateByEventDate(startDate);
        let newEndKData = this.getKDateByEventDate(endDate);
        if(newStartKData && newEndKData){
            let indexStart = dateMapper[newStartKData.date].index;
            let indexEnd = dateMapper[newEndKData.date].index;
            let eventDateList = [];
            for(let i = indexStart;i<=indexEnd;i++){
                let high = this.getHigh(i,dayCount);
                let currentKData = chartData[i];
                if(high== currentKData.high){
                    console.log('找到提前大盘新高：',currentKData.date,dayCount,'天最高价：',high)
                    if(_.findIndex(eventList,{eventDate:currentKData.date,type:'leadNewHigh'})==-1){
                        eventDateList.push(currentKData.date);
                    }
                    break;
                }
            }
            if(eventDateList.length > 0 ){
                eventDateList = _.sortedUniq(eventDateList);
                for(let date of eventDateList){
                    this.addOrUpdateEventByDateAndType(date,'leadNewHigh');
                }
                
            }
        }
        

        

    }

    getHigh=(index,dayCount)=>{
        let {chartData} = this.state;
        let high = chartData[index].high;
        for(let i = 1;i<=dayCount;i++){
            if(chartData[index-i].high>high){
                high = chartData[index-i].high;
            }
        }
        return high;
    }

    addOrUpdateEventByDateAndType=(date,type)=>{
        let {code} = this.state;
        request('/event/addOrUpdateByTypeAndDate',
            (res) => {

                console.log(code,date,'fault','add or update finish!');
                slef.emit('final:event-list-refresh')
                
            }, {
                code:code,
                eventDate:date,
                type:type
            }, 'jsonp')
    }



    renderChart = () => {


        let { chartData, code, mas,dateMapper,eventList } = this.state;
        let ohlc = [];
        let volume = [];
        for (let d of chartData) {
            ohlc.push([
                d.timestamp, // the date
                d.open, // open
                d.high, // high
                d.low, // low
                d.close, // close
            ]);

            volume.push([
                d.timestamp, // the date
                d.lot_volume // the volume
            ]);
        }

        let flagList = [];
        for (let ev of eventList) {
            let kData = this.getKDateByEventDate(ev.eventDate);
            if (kData) {
                let flagObj = {};
                if (ev.type == 'report') {
                    let title = ev.quarter + '季度' + ev.profitsYoy + '%';
                    flagObj = {
                        x: (new Date(moment(kData.date))).getTime(),
                        title: title
                    }
                }else if (ev.type == 'forecast') {
                    let title = ev.quarter + '季度' + (_.includes(ev.ranges, '%') ? ev.ranges : (ev.ranges + '%'))
                    flagObj = {
                        x: (new Date(moment(kData.date))).getTime(),
                        title: title,
                    }
                }else {
                    let title = Dict.eventTypeMapper[ev.type];
                    flagObj = {
                        x: (new Date(moment(kData.date))).getTime(),
                        title: title,
                        fillColor: '#f54545',
                        color: 'red'
                    }
                }
                flagList.push(flagObj)
            }
        }



        


        let initSeries = [{
            type: 'candlestick',
            name: code,
            id: 'dataseries',
            data: ohlc,
            upColor: Config.chart.upColor,
            upLineColor: Config.chart.upColor,
            lineColor: 'silver',
            color: Config.chart.downColor,
            navigatorOptions: {
                color: Highcharts.getOptions().colors[0]
            },

            tooltip: {
                pointFormatter: function () { 
                    // console.log(this)                  
                    if (this.close) {
                        let percent  ;
                        if(this.index>=1){
                            let preData = this.series.data[this.index-1];
                            percent = _.floor((this.close - preData.close) / preData.close * 100, 2)
                        }
                        
                        return '开盘：' + this.open + '<br/>'
                            + '最高：' + this.high + '<br/>'
                            + '最低：' + this.low + '<br/>'
                            + '收盘：' + this.close + '<br/>'
                            + (_.isNumber(percent)?('涨跌幅：' + percent + '%' + '<br/>'):'')
                    }
                }
            },
        }, {
            type: 'column',
            name: '成交量',
            id: 'volume',
            data: volume,
            yAxis: 1,
            tooltip: {
                valueDecimals: 0
            }
        }, {
            type: 'flags',
            onSeries: 'dataseries',
            id: 'event',
            name: 'event',
            index: 10,
            shape: 'squarepin',
            data: flagList,
            dashStyle:'ShortDot',
            y: -60,
            lineWidth:1,
            stackDistance: 20
        }]

        if(_.isArray(mas) && mas.length>0){
            let maSeries = mas.map((ma) => {
                return {
                    type: 'sma',
                    linkedTo: 'dataseries',
                    name: ma,
                    params: {
                        period: ma
                    },
                    id: 'ma' + ma,
                    marker: {
                        enabled: false
                    },
                    lineWidth: 0.5,
                    marker: {
                        radius: 0,
                        width: 0.5,
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                }
            })
    
    
            initSeries = initSeries.concat(maSeries)
        }

        

        // create the chart
        Highcharts.stockChart('main-chart-container', {

            rangeSelector: {
                selected: 2,
                inputEnabled: false,
                buttons: [{ type: "ytd", text: "YTD" },
                { type: "year", count: 1, text: "年" }, 
                { type: 'all', text: 'All'}]
            },

            title: {
                text: ''
            },
            tooltip: {
                shared: true,
                animation: false,
                valueDecimals: 2,
                enabled: true,
                followTouchMove: false,
                followPointer: false,
                positioner: function (labelWidth, labelHeight, point) {
                    if (point.plotX <= labelWidth) {
                        return { x: 800 - labelWidth, y: 10 };
                    }
                    return { x: 10, y: 10 };
                },
                shadow: false,
                split: false,
                backgroundColor: 'white',
                borderWidth: 0,
                borderRadius: 0,
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
                crosshair: {
                    snap: false
                },
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
            scrollbar: {

            },
            series: initSeries
        });
    }


    render() {
       

        return (
            <div className={'s-chart-wrap'} >
                <div className="mt10" id="main-chart-container" style={{ width: Config.chart.width, minHeight: Config.chart.height }}>
                </div>
            </div>
        );
    }
}