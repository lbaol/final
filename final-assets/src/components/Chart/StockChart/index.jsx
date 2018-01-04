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
            code: '',
            period: 'day',
            startDate: '',
            endDate: '',
            chartData: {},
            dateMapper: {},
            mas: []
        };
    }

    componentWillMount() {
    }

    componentDidMount() {

        this.on('final:stock-chart-refresh', (data) => {
            this.emitRefresh(data)
        });
    }

    emitRefresh = (data) => {
        const { code, period, startDate, endDate, mas } = this.state;
        if(data){
            this.setState({
                ...this.state,
                ...data,
                code:data.code?data.code:this.state.code
            }, this.fatchChartData)
        }else{
            this.fatchChartData()
        }
        
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
       const {code,chartData,mas,period} = this.state;

        return (
            <KChart code={code} chartData={chartData} mas={mas} notCheckEvent={period=='day'?false:true}/>
        );
    }
}