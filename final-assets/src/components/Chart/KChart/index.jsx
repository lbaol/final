import React, { Component } from 'react';
// import Highcharts from 'highcharts/highstock';
// import 'highcharts/highcharts-more.js';
// import indicators from 'highcharts/indicators/indicators.js';

import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import { Radio, Checkbox } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import { request,request2 } from "common/ajax.js";
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
            reportList:[],
            dateMapper: {},
            displayEvent:props.displayEvent == false?false:true,
            displayReport:props.displayReport == false?false:true
        };
        this._id = 'chart'+Math.random();
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
            chartData:chartData
        },this.fatchData)
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.chartData, this.props.chartData)){
            this.setState({
                ...nextProps
            },this.initData)
        }

        if(!_.isEqual(nextProps.displayEvent, this.props.displayEvent)||!_.isEqual(nextProps.displayReport, this.props.displayReport)){
            this.setState({
                ...nextProps
            },this.initData)
        }
    }



    fatchData = async () => {
        const self = this;
        const { code,displayEvent,displayReport } = this.state;

        let eventList = [];
        let reportList = [];
        
        if(displayEvent == true){
            //获取Event
            const respEvent = await request2('/event/getByParams',{
                code: code,
                notInTypes:'report,forecast'
            }, 'jsonp')
        

            let resEvent = respEvent.data;
            eventList = resEvent.eventList;
            eventList = _.orderBy(eventList, ['eventDate'], ['desc']);
        }

       

        if(displayReport == true){
            const respReport = await request2('/event/getByParams',{
                code: code,
                types:'report,forecast'
            }, 'jsonp')
        
    
            let resReport = respReport.data;
            reportList = resReport.eventList;
            reportList = _.orderBy(reportList, ['eventDate'], ['desc']);
        }

       
        
        
        self.setState({
            eventList: eventList,
            reportList:reportList
        }, ()=>{
            this.renderChart();
        })
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

 
    getFlagListByEventList=(eventList)=>{
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
        return flagList;
    }
    



    renderChart = () => {
        let {defaultRangeSelector} =this.props;

        let { chartData, code, mas,dateMapper,eventList,displayEvent,reportList,displayReport } = this.state;
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
        }]

        let flagList = [];

        if(displayEvent == true){
            //组装event flag配置
            let flagList = this.getFlagListByEventList(eventList)
            initSeries = initSeries.concat({
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
            })
        }

        if(displayReport == true){
            //组装event flag配置
            let flagList = this.getFlagListByEventList(reportList)
            initSeries = initSeries.concat({
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
            })
        }


        
        

        //组装均线配置
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
        Highcharts.stockChart(this._id, {
            scrollbar: {
                enabled: false
            },
            navigator:{
                enabled: false
            },
            rangeSelector: {
                selected: _.isNumber(defaultRangeSelector)?defaultRangeSelector:1,
                inputEnabled: false,
                buttons: [{ type: "ytd", text: "YTD" },
                { type: "year", count: 1, text: "1y" }, 
                { type: "year", count: 2, text: "2y" },
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
                height: '84%',
                lineWidth: 1,
                crosshair: {
                    snap: false
                },
                resize: {
                    enabled: true
                }
            },
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top: '85%',
                height: '15%',
                offset: 0,
                lineWidth: 1
            }
            ],
            series: initSeries
        });
    }


    render() {
       

        return (
            <div className={'s-chart-wrap'} >
                <div className="mt10" id={this._id} style={{ width: Config.chart.width, minHeight: Config.chart.height }}>
                </div>
            </div>
        );
    }
}