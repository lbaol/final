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
import './index.scss';



Highcharts.setOptions(defaultConfig);

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            period: 'day',
            startDate: '',
            endDate: '',
            chartData: {},
            baseInfo: {},
            dateMapper: {},
            mas: []
        };
    }

    componentWillMount() {
    }

    componentDidMount() {



        this.on('final:main-chart-refresh', (data) => {
            this.emitRefresh(data)
        });


        this.on('final:event-edit-finish', (data) => {
            this.emitRefresh(data)
        });
    }

    emitRefresh = (data) => {
        console.log("data", data)
        const { code, period, startDate, endDate, mas } = this.state;
        this.setState({
            code: data && data.code ? data.code : code,
            period: data && data.period ? data.period : period,
            startDate:data && data.startDate ? data.startDate : startDate,
            endDate: data && data.endDate ? data.endDate : endDate,
            mas: data && data.mas ? data.mas : mas
        }, this.fatchChartData)
    }




    fatchEventList = () => {
        const self = this;
        const { code } = this.state;
        request('/event/getByCode',
            (res) => {


                let eventList = res.eventList;

                eventList = _.orderBy(eventList, ['eventDate'], ['desc']);
                res.eventList = eventList;


                self.setState({
                    baseInfo: res
                }, self.renderChart)
            }, {
                code: code
            }, 'jsonp')
    }

    fatchChartData() {
        const self = this;
        const { code, period, startDate, endDate } = this.state;
        if (code) {
            let newCode = Util.getFullCode(code);
            let newStartDate = moment(startDate);
            let newEndDate = moment(endDate)

            request('https://xueqiu.com/stock/forchartk/stocklist.json?type=before',
                (res) => {

                    let chartList = res.chartlist;
                    let dateMapper = {}
                    for (let cha of chartList) {
                        let date = moment(cha.timestamp).format('YYYY-MM-DD');
                        cha.date = date;
                        dateMapper[date] = cha;
                    }
                    console.log('dateMapper',dateMapper)
                    self.setState({
                        chartData: chartList,
                        dateMapper: dateMapper
                    }, self.fatchEventList)





                }, {
                    symbol: newCode,
                    period: '1' + period,
                    begin: newStartDate.set('hour', 0).set('minute', 0).format('x'),
                    end: newEndDate.set('hour', 23).set('minute', 59).format('x'),

                }, 'jsonp')
        }
    }

    getReportPriceByDate = (date) => {
        let { chartData, dateMapper } = this.state;
        if (chartData) {
            let cha = dateMapper[date];

            if (!cha) {
                //如果没找到对应的日期，继续找
                cha = this.getWeekDateIndex(chartData, date)
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



    renderChart = () => {


        let { chartData, baseInfo, code, mas } = this.state;
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

        let eventList = baseInfo.eventList;
        let flagList = [];
        for (let ev of eventList) {
            let datePrice = this.getReportPriceByDate(ev.eventDate);
            if (datePrice) {
                let flagObj = {};
                if (ev.type == 'report') {
                    let title = ev.quarter + '季度' + ev.profitsYoy + '%';
                    flagObj = {
                        x: (new Date(moment(datePrice.date))).getTime(),
                        title: title
                    }
                }else if (ev.type == 'forecast') {
                    let title = ev.quarter + '季度' + (_.includes(ev.ranges, '%') ? ev.ranges : (ev.ranges + '%'))
                    flagObj = {
                        x: (new Date(moment(datePrice.date))).getTime(),
                        title: title,
                    }
                }else {
                    let title = Dict.eventTypeMapper[ev.type];
                    flagObj = {
                        x: (new Date(moment(datePrice.date))).getTime(),
                        title: title,
                        fillColor: '#f54545',
                        color: 'red'
                    }
                }
                flagList.push(flagObj)
            }
        }

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


        initSeries = initSeries.concat(maSeries)

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
        const { baseInfo, period, maOptions, maValue } = this.state;
        const basic = baseInfo.basic || {};

        return (
            <div className={'s-chart-wrap'} >
                <div className="mt10" id="main-chart-container" style={{ width: Config.chart.width, minHeight: Config.chart.height }}>
                </div>
            </div>
        );
    }
}