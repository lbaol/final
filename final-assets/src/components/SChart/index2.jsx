import React, {Component} from 'react';
import Highcharts from 'highcharts/highstock';
import $ from 'jquery';
import _ from 'lodash';
import FEvents from "../FEvent/index.js";
import {request} from "../../common/ajax.js";
import {URL, Util} from "../../common/config.js";
import './index.scss';






@FEvents
export default class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
			
        };
    }

    componentDidMount() {
        // this.fatchChartData();
        this.renderChart();
    }
    
    renderChart=()=>{
        $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?', function (data) {

            // split the data set into ohlc and volume
            var ohlc = [],
                volume = [],
                dataLength = data.length,
                // set the allowed units for data grouping
                groupingUnits = [[
                    'week',                         // unit name
                    [1]                             // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]],

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
                    lineWidth: 2,
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
                    lineWidth: 2
                }],

                tooltip: {
                    split: true
                },

                series: [{
                    type: 'candlestick',
                    name: 'AAPL',
                    data: ohlc,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: 'Volume',
                    data: volume,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        });
    }

	fatchChartData(){
		const self = this;
		request('https://xueqiu.com/stock/forchartk/stocklist.json?symbol=SZ002008&period=1day&type=before&begin=1479282359497&end=1510818359497',
		(res)=>{

			
			
		},{},'jsonp')
	}

	

    render() {
        return (
            <div className="s-chart-wrap" id="container" style={{ width: 500, height: 300 }}></div>
        );
    }
}