import React, {Component} from 'react';
// 引入 ECharts 主模块
import * as echarts from 'echarts';
// 引入candlestick图
import  'echarts/lib/chart/candlestick';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import _ from 'lodash';
import fecha from 'fecha';
import FEvents from "../FEvent/index.js";
import {request} from "../../common/ajax.js";
import {URL, Util} from "../../common/config.js";

const upColor = '#00da3c';
const downColor = '#ec0000';

let stockChart ;
let chartData;
const rawData = [
	[
		"2016-06-01",
		17754.55,
		17789.67,
		17664.79,
		17809.18,
		78530000
	],
	[
		"2016-06-02",
		17789.05,
		17838.56,
		17703.55,
		17838.56,
		75560000
	],
	[
		"2016-06-03",
		17799.8,
		17807.06,
		17689.68,
		17833.17,
		82270000
	],
	[
		"2016-06-06",
		17825.69,
		17920.33,
		17822.81,
		17949.68,
		71870000
	],
	[
		"2016-06-07",
		17936.22,
		17938.28,
		17936.22,
		18003.23,
		78750000
	],
	[
		"2016-06-08",
		17931.91,
		18005.05,
		17931.91,
		18016,
		71260000
	],
	[
		"2016-06-09",
		17969.98,
		17985.19,
		17915.88,
		18005.22,
		69690000
	],
	[
		"2016-06-10",
		17938.82,
		17865.34,
		17812.34,
		17938.82,
		90540000
	],
	[
		"2016-06-13",
		17830.5,
		17732.48,
		17731.35,
		17893.28,
		101690000
	],
	[
		"2016-06-14",
		17710.77,
		17674.82,
		17595.79,
		17733.92,
		93740000
	],
	[
		"2016-06-15",
		17703.65,
		17640.17,
		17629.01,
		17762.96,
		94130000
	],
	[
		"2016-06-16",
		17602.23,
		17733.1,
		17471.29,
		17754.91,
		91950000
	],
	[
		"2016-06-17",
		17733.44,
		17675.16,
		17602.78,
		17733.44,
		248680000
	],
	[
		"2016-06-20",
		17736.87,
		17804.87,
		17736.87,
		17946.36,
		99380000
	],
	[
		"2016-06-21",
		17827.33,
		17829.73,
		17799.8,
		17877.84,
		85130000
	],
	[
		"2016-06-22",
		17832.67,
		17780.83,
		17770.36,
		17920.16,
		89440000
	]
]


@FEvents
export default class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
			code:props.code,
			cycle:props.cycle?props.cycle:'day'
        };
    }

    componentDidMount() {
        this.fatchChartData();
        
        this.on('chart:refresh', (data) => {
            console.log('get',data)
        });
	}

	fatchChartData(){
		const self = this;
		request('https://xueqiu.com/stock/forchartk/stocklist.json?symbol=SZ002008&period=1day&type=before&begin=1479282359497&end=1510818359497',
		(res)=>{

			chartData = self.parseXQStockData(res.chartlist)
			self.renderChart();
		},{},'jsonp')
	}

	parseXQStockData=(dataList)=>{
		if(dataList){
			let categoryData = [];
			let values = [];
			let volumes = [];
			for (let d1 of dataList) {
				categoryData.push(fecha.format(new Date(d1.timestamp), 'YYYY-MM-DD'));
				values.push([d1.open,d1.close,d1.low,d1.high]);
				volumes.push(d1.lot_volume);
			}
		
			return {
				categoryData: categoryData,
				values: values,
				volumes: volumes
			};
		}
		
	}


	splitData =(rawData) =>{
		var categoryData = [];
		var values = [];
		var volumes = [];
		for (var i = 0; i < rawData.length; i++) {
			categoryData.push(rawData[i].splice(0, 1)[0]);
			values.push(rawData[i]);
			volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
		}
	
		return {
			categoryData: categoryData,
			values: values,
			volumes: volumes
		};
	}
	
	calculateMA =(dayCount, data)=> {
		var result = [];
		for (var i = 0, len = data.values.length; i < len; i++) {
			if (i < dayCount) {
				result.push('-');
				continue;
			}
			var sum = 0;
			for (var j = 0; j < dayCount; j++) {
				sum += data.values[i - j][1];
			}
			result.push(+(sum / dayCount).toFixed(3));
		}
		return result;
	}
	
	renderChart=()=>{
		// 基于准备好的dom，初始化echarts实例
		
        
        
        
        
        stockChart = echarts.init(document.getElementById('main'));
        stockChart.setOption({
            backgroundColor: '#fff',
            animation: false,
            legend: {
                bottom: 10,
                left: 'center',
                data: ['k', 'MA5', 'MA10', 'MA20', 'MA30']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                position: function (pos, params, el, elRect, size) {
                    var obj = {top: 10};
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                }
                // extraCssText: 'width: 170px'
            },
            axisPointer: {
                link: {xAxisIndex: 'all'},
                label: {
                    backgroundColor: '#777'
                }
            },
            // visualMap: {
            //     show: false,
            //     seriesIndex: 5,
            //     dimension: 2,
            //     pieces: [{
            //         value: 1,
            //         color: downColor
            //     }, {
            //         value: -1,
            //         color: upColor
            //     }]
            // },
            grid: [
                {
                    left: '10%',
                    right: '8%',
                    height: '50%'
                },
                {
                    left: '10%',
                    right: '8%',
                    top: '63%',
                    height: '16%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: chartData.categoryData,
                    scale: true,
                    boundaryGap : false,
                    axisLine: {onZero: false},
                    splitLine: {show: false},
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        z: 100
                    }
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    data: chartData.categoryData,
                    scale: true,
                    boundaryGap : false,
                    axisLine: {onZero: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {show: false},
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax'
                    // axisPointer: {
                    //     label: {
                    //         formatter: function (params) {
                    //             var seriesValue = (params.seriesData[0] || {}).value;
                    //             return params.value
                    //             + (seriesValue != null
                    //                 ? '\n' + echarts.format.addCommas(seriesValue)
                    //                 : ''
                    //             );
                    //         }
                    //     }
                    // }
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                },
                {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: {show: false},
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false}
                }
            ],
            dataZoom: [
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '85%',
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    name: 'k',
                    type: 'candlestick',
                    data: chartData.values,
                    itemStyle: {
                        normal: {
                            color: '#fff',
                            color0: '#fff',
                            borderColor: '#f5f5f5',
                            borderColor0: '#ccc'
                        }
                    },
                    markPoint: {
                        data: [
                            {
                                name: 'XX标点',
                                coord: ['2016-06-15',17760],
                                value:'asdfdf',
                                itemStyle: {
                                    normal: {color: '#ccc'}
                                },
								symbol:'pin',
								symbolSize:[0,100],
								label:{
									normal:{
										formatter: function (param) {
											return param.value;
										}
									}
								}
							},
							{
                                name: 'XX标点',
                                coord: ['2016-06-08',18000],
                                value:'asdfdf',
                                itemStyle: {
                                    normal: {color: '#ccc'}
                                },
								symbol:'pin',
								symbolSize:[0,100],
								label:{
									normal:{
										formatter: function (param) {
											return param.value;
										}
									}
								}
							}
						]
                    },
                    tooltip: {
                        formatter: function (param) {
                            param = param[0];
                            return [
                                'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                'Open: ' + param.data[0] + '<br/>',
                                'Close: ' + param.data[1] + '<br/>',
                                'Lowest: ' + param.data[2] + '<br/>',
                                'Highest: ' + param.data[3] + '<br/>'
                            ].join('');
                        }
                    }
                },
                // {
                //     name: 'MA5',
                //     type: 'line',
                //     data: this.calculateMA(5, data),
                //     smooth: true,
                //     lineStyle: {
                //         normal: {opacity: 0.5}
                //     }
                // },
                // {
                //     name: 'MA10',
                //     type: 'line',
                //     data: this.calculateMA(10, data),
                //     smooth: true,
                //     lineStyle: {
                //         normal: {opacity: 0.5}
                //     }
                // },
                // {
                //     name: 'MA20',
                //     type: 'line',
                //     data: this.calculateMA(20, data),
                //     smooth: true,
                //     lineStyle: {
                //         normal: {opacity: 0.5}
                //     }
                // },
                // {
                //     name: 'MA30',
                //     type: 'line',
                //     data: this.calculateMA(30, data),
                //     smooth: true,
                //     lineStyle: {
                //         normal: {opacity: 0.5}
                //     }
                // },
                // {
                //     name: 'Volume',
                //     type: 'bar',
                //     xAxisIndex: 1,
                //     yAxisIndex: 1,
                //     data: chartData.volumes
                // }
            ]
        });
        
            // stockChart.on('brushSelected', renderBrushed);
        
            // function renderBrushed(params) {
            //     var sum = 0;
            //     var min = Infinity;
            //     var max = -Infinity;
            //     var countBySeries = [];
            //     var brushComponent = params.brushComponents[0];
        
            //     var rawIndices = brushComponent.series[0].rawIndices;
            //     for (var i = 0; i < rawIndices.length; i++) {
            //         var val = data.values[rawIndices[i]][1];
            //         sum += val;
            //         min = Math.min(val, min);
            //         max = Math.max(val, max);
            //     }
        
            //     panel.innerHTML = [
            //         '<h3>STATISTICS:</h3>',
            //         'SUM of open: ' + (sum / rawIndices.length).toFixed(4) + '<br>',
            //         'MIN of open: ' + min.toFixed(4) + '<br>',
            //         'MAX of open: ' + max.toFixed(4) + '<br>'
            //     ].join(' ');
            // }
        
            // stockChart.dispatchAction({
            //     type: 'brush',
            //     areas: [
            //         {
            //             brushType: 'lineX',
            //             coordRange: ['2016-06-02', '2016-06-20'],
            //             xAxisIndex: 0
            //         }
            //     ]
            // });
	}

    render() {
        return (
            <div id="main" style={{ width: 500, height: 300 }}></div>
        );
    }
}