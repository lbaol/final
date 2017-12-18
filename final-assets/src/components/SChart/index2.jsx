import React, {Component} from 'react';
import Highcharts from 'highcharts/highstock';
import $ from 'jquery';
import _ from 'lodash';
import FEvents from "../FEvent/index.js";
import {request} from "../../common/ajax.js";
import {URL, Util} from "../../common/config.js";
import {defaultConfig} from "../../common/chartConfig.js";
import './index.scss';



Highcharts.setOptions(defaultConfig);


@FEvents
export default class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
			
        };
    }

    componentDidMount() {
        this.fatchChartData();
        // this.renderChart();
    }
    
    renderChart=()=>{
        $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?', function (data) {

            // split the data set into ohlc and volume
            var ohlc = [],
                volume = [],
                dataLength = data.length,
                i = 0;

            for (i; i < dataLength; i += 1) {
                ohlc.push([
                    data[i][0], // the date
                    data[i][1], // open
                    data[i][2], // high
                    data[i][3], // low
                    data[i][4] // close
                ]);

                volume.push([
                    data[i][0], // the date
                    data[i][5] // the volume
                ]);
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
                    name: '',
                    data: ohlc
                }, {
                    type: 'column',
                    name: 'Volume',
                    data: volume,
                    yAxis: 1
                }]
            });
        });
    }

    parseXQStockData=(dataList)=>{
		
		
	}

	fatchChartData(){
		const self = this;
		request('https://xueqiu.com/stock/forchartk/stocklist.json?symbol=SZ002008&period=1day&type=before&begin=1479282359497&end=1510818359497',
		(res)=>{
            console.log(res)
            let dataList = res.chartlist;
            let ohlc = [];
            let volume = [];
            for(let d of dataList){
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
                    name: '',
                    data: ohlc
                }, {
                    type: 'column',
                    name: 'Volume',
                    data: volume,
                    yAxis: 1
                }]
            });
			
			
		},{},'jsonp')
	}

	

    render() {
        return (
            <div className="s-chart-wrap" id="container" style={{ width: 500, height: 300 }}></div>
        );
    }
}