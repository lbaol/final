import React, {Component} from 'react';
// 引入 ECharts 主模块
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import moment from 'moment';
import FEvents from "../FEvent/index.js";
import {request} from "../../common/ajax.js";
import {URL, Util} from "../../common/config.js";

const upColor = '#00da3c';
const downColor = '#ec0000';

let pinHeigth = 100;



@FEvents
export default class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
			code:'002008',
            period:'week',
            startDate:'',
            endDate:'',
            chartData:{},
            baseInfo:{},
            chartOption:{}
        };
    }

    componentDidMount() {
        this.fatchChartData();
        
        this.on('chart:refresh', (data) => {
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

            let newStartDate = startDate ? moment(startDate) :moment().subtract(365*3, 'day');
            let newEndDate = endDate ? moment(endDate):moment()

            request('https://xueqiu.com/stock/forchartk/stocklist.json?type=before',
            (res)=>{
    
                const chartData = self.parseXQStockData(res.chartlist)
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
    
    fatchBaseInfo=()=>{
        const self = this;
        const {code} = this.state;
        request('http://localhost:8080/stock/getByCode',
		(res)=>{

			self.setState({
                baseInfo:res
            },self.renderChart)
		},{
            code:code
        },'jsonp')
    }


    renderChart=()=>{
        let option = this.getOption();
        console.log('准备使用option渲染：',option,option.series[0].markPoint);
        this.setState({
            chartOption:option
        })
    }

	parseXQStockData=(dataList)=>{
		if(dataList){
			let categoryData = [];
			let values = [];
			let volumes = [];
			for (let d1 of dataList) {
				categoryData.push(moment(new Date(d1.timestamp)).format('YYYY-MM-DD'));
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

    getWeekDateIndex=(dates,date)=>{
        let i = 0;
        for( ; i<dates.length;i++){
            if(dates[i]>=date){
                break;
            }
        }
        if(i<dates.length-1){
            return i;
        }
        if(i==(dates.length-1)){
            if(dates[i]>=date){
                return i;
            }
        }
        return -1;
    }

    getReportPriceByDate=(date)=>{
        let {chartData} = this.state;
        if(chartData){
            let idx1 = _.indexOf(chartData.categoryData,date);
            
            if(idx1==-1){
                //如果没找到对应的日期，继续找
                idx1 = this.getWeekDateIndex(chartData.categoryData,date)
            }

            if(idx1>=0){
                //如果找到对应的日期
                console.log('找到日期',chartData.categoryData[idx1],chartData.values[idx1])
                return {
                    date:chartData.categoryData[idx1],
                    price:chartData.values[idx1][3] //取最高价
                }
            }
            
            
        }
        return null;
    }
    
    getOption=()=>{

        let {chartData,baseInfo} = this.state;

        let pointList = [];
        let pointCfgSource = {
            name: '',
            coord: [],
            value:'',
            itemStyle: {
                normal: {color: '#ccc'}
            },
            symbol:'pin',
            symbolSize:[0,100],
            label:{
                normal:{
                    formatter: function (param) {
                        console.log('point',param)
                        return param.value;
                    }
                }
            }
        }

        pinHeigth = 30;
        if(baseInfo.report && _.isArray(baseInfo.report) && baseInfo.report.length>0){
            let reportList = baseInfo.report;
            for(let d of reportList){
                let datePrice = this.getReportPriceByDate(d.reportDate);
                if(datePrice){
                    let price = datePrice && datePrice.price;
                    let pointCfg = _.cloneDeep(pointCfgSource);
                    pointCfg.name = d.reportDate;
                    pointCfg.coord =  [datePrice.date,price];
                    pointCfg.value = d.profitsYoy;
                    pointCfg.symbolSize = [1,pinHeigth=pinHeigth+10];
                    pointList.push(pointCfg)
                }   
                
            }
        }

        if(baseInfo.forecast && _.isArray(baseInfo.forecast) && baseInfo.forecast.length>0){
            let forecastList = baseInfo.forecast;
            for(let d of forecastList){
                let datePrice = this.getReportPriceByDate(d.reportDate);
                if(datePrice){
                    let pointCfg = _.cloneDeep(pointCfgSource);
                    pointCfg.name = d.reportDate;
                    pointCfg.coord =  [datePrice.date,datePrice.price];
                    pointCfg.value = d.ranges;
                    pointCfg.symbolSize = [1,pinHeigth=pinHeigth+10];
                    pointList.push(pointCfg)
                }
                
                
            }
        }

        

        return {
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
                    show:false,
                    type: 'category',
                    data: chartData && chartData.categoryData,
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
                    data: chartData && chartData.categoryData,
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
                    data: chartData && chartData.values,
                    itemStyle: {
                        normal: {
                            color: '#fff',
                            color0: '#fff',
                            borderColor: '#f5f5f5',
                            borderColor0: '#ccc'
                        }
                    },
                    markPoint: {
                        data: pointList
                    },
                    tooltip: {
                        formatter: function (param) {
                            console.log('param',param)
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
                //     data: chartData && chartData.volumes
                // }
            ]
        }
    }
	
	renderChart2=()=>{
		// 基于准备好的dom，初始化echarts实例
		
        
        
        
        
        stockChart = echarts.init(document.getElementById('main'));
        stockChart.setOption();
        
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

        const {chartOption} = this.state;

        return (
            <div id="main" style={{ width: 500, height: 300 }}>
                <ReactEcharts
                    theme='infographic'
                    notMerge={true}
                    option={chartOption}
                    style={{ height: '100%', width: '100%' }}
                    className='s-chart'
                    ref='s-chart'
                />
            </div>
        );
    }
}