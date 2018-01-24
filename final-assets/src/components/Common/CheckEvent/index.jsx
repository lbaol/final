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
            chartData:props.chartData,
            code:props.code,
            dateMapper: {}
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
            chartData:chartData
        },this.checkEvents)
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.chartData, this.props.chartData)){
            this.setState({
                ...nextProps
            },this.initData)
            
        }
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
        let {needCheckEvent} = this.state;
        if(needCheckEvent == true){
            this.checkFaultEvents()
            this.checkLeadNewHighEvents();
        }
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
                        if((after.close/before.close)>1.07 && (after.open > before.close) && kData.index>=20 ){
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
                        if((after.close/before.close)>1.07 && (after.open > before.close) && kData.index>=20){
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
        let startDate = Config.indexPeakValley[0].start;
        let endDate = Config.indexPeakValley[0].end;
        
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
            if(chartData && chartData[index-i] && chartData[index-i].high && high && (chartData[index-i].high > high)){
                high = chartData[index-i].high;
            }
        }
        return high;
    }

    addOrUpdateEventByDateAndType=(date,type)=>{
        let {code} = this.state;
        const self = this;
        request('/event/addOrUpdateByTypeAndDate',
            (res) => {

                console.log(code,date,'fault','add or update finish!');
                self.emit('final:event-list-refresh')
                
            }, {
                code:code,
                eventDate:date,
                type:type
            }, 'jsonp')
    }




    render() {
       

        return (
            <div  >
                
            </div>
        );
    }
}