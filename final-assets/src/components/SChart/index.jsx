import React, {Component} from 'react';
// import Highcharts from 'highcharts/highstock';
// import 'highcharts/highcharts-more.js';
// import indicators from 'highcharts/indicators/indicators.js';

import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import FEvents from "../FEvent/index.js";
import {request} from "../../common/ajax.js";
import {URL, Util,Config} from "../../common/config.js";
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
            baseInfo:{}
        };
    }

    componentDidMount() {
        
        this.on('final:main-chart-refresh', (data) => {
            console.log("data",data)
            const {code,period,startDate,endDate}  = this.state;
            this.setState({
                code:data.code?data.code:code,
                period:data.period?data.period:period,
                startDate:data.startDate?data.startDate:startDate,
                endDate:data.endDate?data.endDate:endDate
            },this.fatchChartData)
            
        });
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

                const chartData = res.chartlist
                self.setState({
                    chartData:chartData
                },self.fatchBaseInfo)


                
                
                
            },{
                symbol:newCode,
                period:'1'+period,
                begin:newStartDate.set('hour', 0).set('minute', 0).format('x'),
                end:newEndDate.set('hour', 23).set('minute', 59).format('x'),
            
            },'jsonp')
        }
	}

    renderChart=()=>{

        
        let {chartData,baseInfo,code} = this.state;
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
            let title = ''
            if(ev.type == 'report'){
                title = ev.quarter+'季度' + ev.profitsYoy+'%'
            }
            if(ev.type == 'forecast'){
                title = ev.quarter+'季度' + (_.includes(ev.ranges,'%')?ev.ranges:(ev.ranges+'%'))
            }
            let ds = ev.eventDate.split('-');
            flagList.push({
                x: (new Date(moment(ev.eventDate))).getTime(),
                title: title,
            })
        }

        // create the chart
        Highcharts.stockChart('container', {
            
            rangeSelector: {
                selected: 1
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
                height: '60%',
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
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 1
            }],

            tooltip: {
                split: true
            },

            series: [{
                type: 'candlestick',
                name: 'code',
                id: 'dataseries',
                data: ohlc
            }, {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1
            },{
                type: 'flags',
                onSeries: 'dataseries',
                shape: 'squarepin',
                data: flagList
            }, {
                type: 'sma',
                linkedTo: 'dataseries',
                name: 'SMA (50)',
                params: {
                    period: 50
                }
            }]
        });
    }
	

    render() {
        return (
            <div className="s-chart-wrap" id="container" style={{ width: Config.chart.width, height: Config.chart.height }}></div>
        );
    }
}