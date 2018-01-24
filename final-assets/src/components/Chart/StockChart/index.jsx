import React, { Component } from 'react';
// import Highcharts from 'highcharts/highstock';
// import 'highcharts/highcharts-more.js';
// import indicators from 'highcharts/indicators/indicators.js';

import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import { Radio, Checkbox } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import KChart from "components/Chart/KChart/index.jsx";
import { request } from "common/ajax.js";
import { URL, Util, Config, Env,Dict } from "common/config.js";
import { defaultConfig } from "common/chartConfig.js";



Highcharts.setOptions(defaultConfig);

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: props.code?props.code:'',
            period: props.period?props.period:'day',
            startDate: '',
            endDate: '',
            chartData: {},
            dateMapper: {},
            mas: [],
            displayEvent:props.displayEvent == false?false:true,
            displayReport:props.displayReport == false?false:true,
            type:props.type?props.type:'stock' //stock,index
        };
    }

    componentWillMount() {
        let {period} = this.state;
        this.setState({
            mas:Config.defalutMas[period],
            startDate:Config.defaultChart.startDate,
            endDate:Config.defaultChart.endDate
        })
    }

    componentDidMount() {
        this.fatchChartData();

        this.on('final:stock-chart-refresh',(data)=>{
            if(data && data.code && data.code == this.state.code){
                this.fatchChartData();
            }
        })

        this.on('final:stock-chart-display',(data)=>{
            this.setState({
                ...data
            })
        })
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('code') && !_.isEqual(this.state.code, nextProps.code)) {
            this.setState({
                code: nextProps.code
            }, this.fatchChartData)
        }
    }

   

    fatchChartData() {
        const self = this;
        const { code, period, startDate, endDate,type } = this.state;
        if (code) {
            let newCode = (type=='stock'? Util.getFullCode(code):code);
            let newStartDate = moment(startDate);
            let newEndDate = moment(endDate)

            request('https://xueqiu.com/stock/forchartk/stocklist.json?type=before',
                (res) => {

                    let chartList = res.chartlist;
                    for (let cha of chartList) {
                        let date = moment(cha.timestamp).format('YYYY-MM-DD');
                        cha.date = date;
                    }
                    self.setState({
                        chartData: chartList
                    })

                }, {
                    symbol: newCode,
                    period: '1' + period,
                    begin: newStartDate.set('hour', 0).set('minute', 0).format('x'),
                    end: newEndDate.set('hour', 23).set('minute', 59).format('x'),

                }, 'jsonp')
        }
    }







    render() {
       const {code,chartData,mas,period,displayEvent,displayReport} = this.state;
       const {needCheckEvent,defaultRangeSelector} = this.props;

        return (
            <KChart code={code} needCheckEvent={needCheckEvent} displayReport={displayReport} displayEvent={displayEvent} chartData={chartData} mas={mas} defaultRangeSelector={defaultRangeSelector} />
        );
    }
}