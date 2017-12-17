import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Tabs, Table,Pagination ,Radio} from 'antd';
import FEvents from "../FEvent/index.js";

import { request } from "../../common/ajax.js";
import { URL, Util } from "../../common/config.js";
import './index.scss';


const TabPane = Tabs.TabPane;


let _eventList = {
    allList : [],
    increaseList : [],
    otherList : []
}

let _allStocksMap = [];

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            period: 'day',
            startDate: '',
            reportList: [],
            defaultReportList:'increaseList'
        };
    }

    componentDidMount() {
        this.fatchAllStocks();
    }

    fatchAllStocks =()=>{
        const self = this;
        request('/stock/getAllStocks',
            (res) => {
                if(res){
                    for(let st of res){
                        _allStocksMap[st.code] = st
                    }
                }
                self.fatchReportList();
            }, {
            }, 'jsonp')
    }

    fatchReportList = () => {
        const self = this;
        const {defaultReportList} = this.state;
        request('/stock/getAllEvents',
            (res) => {
                
                let allList = res.eventList;
                let increaseList = [];
                let otherList = [];
                const afterDate = '20170601'
                
                let i = 0;
                for (let d of allList) {
                    let st = _allStocksMap[d.code];
                    d.key = i++;
                    if(d.type == 'report'){
                        if (d.profitsYoy <= 0 || (st && st.timeToMarket > afterDate)) {
                            otherList.push(d)
                        } else {
                            increaseList.push(d)
                        }
                    }
                    if(d.type == 'forecast'){
                        if (d.ranges.indexOf('-') >= 0 ||d.ranges== 0 || (st && st.timeToMarket > afterDate)) {
                            otherList.push(d)
                        } else {
                            increaseList.push(d)
                        }
                    }
                    
                }

                _eventList.increaseList = _.orderBy(increaseList, ['eventDate'], ['desc']);
                _eventList.otherList = _.orderBy(otherList, ['eventDate'], ['desc']);
                _eventList.allList = _.orderBy(allList, ['eventDate'], ['desc']);
                
                
                self.setState({
                    reportList: _eventList[defaultReportList]
                })

            }, {
            }, 'jsonp')
    }

    onFieldChange = (name, value) => {
        this.fieldChange(name, value);
    }

    onInputFieldChange = (name) => {
        let value = ReactDOM.findDOMNode(this.refs['s-filter-' + name]).value;
        this.fieldChange(name, value);
    }

    onDateFieldChange = (name, value, valueString) => {
        this.fieldChange(name, valueString);
    }

    onSearchClick = () => {
        this.emit('chart:refresh', this.state)
    }

    onShowChartClick=(code)=>{
        this.emit('chart:refresh', {
            ...this.state,
            code:code
        })
    }

    fieldChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    onShowResultChange=(e)=>{
        this.setState({
            reportList:_eventList[e.target.value]
        })
    }

    render() {
        const { code, period, reportList,defaultReportList } = this.state;
        const pagination = {
            otal:reportList.length,
            pageSize:100
        }
        return (

            <div className="s-filter">
                <Tabs onChange={this.onTabChange} type="card" size="small">
                    <TabPane tab="报表预告"  key="report-list">
                        <div>
                            <Radio.Group  onChange={this.onShowResultChange} defaultValue={defaultReportList} size="small">
                                <Radio.Button value="allList">全部</Radio.Button>
                                <Radio.Button value="increaseList">增长</Radio.Button>
                                <Radio.Button value="otherList">其他</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className="mt10">
                            <Table size="small" className="report-list-table"
                                pagination={pagination}
                                dataSource={reportList}
                                scroll={{ x: true, y: 300 }}
                                columns={[{
                                    title: '名称',
                                    dataIndex: 'name',
                                    key:'name',
                                    render: (text, record) => (
                                        <span className="cursor-p" onClick={this.onShowChartClick.bind(this,record.code)}>
                                            {text}
                                        </span>
                                    )
                                }, {
                                    title: '日期',
                                    dataIndex: 'eventDate',
                                    key:'eventDate'
                                },{
                                    title: '类型',
                                    dataIndex: 'type',
                                    key:'type',
                                    render: (text, record) => {
                                        return (<div>
                                            {text=='report' && <span className="c-blue">报告</span>}
                                            {text=='forecast' &&  <span className="c-green">预告</span>}
                                        </div>)
                                        
                                    }
                                },{
                                    title: '业绩',
                                    key:'key1',
                                    render: (text, record) => (
                                        <span>
                                            {record.type == 'report' && (record.profitsYoy+'%')}
                                            {record.type == 'forecast' && record.ranges}
                                        </span>
                                    ),
                                }]}  />
                        </div>
                        
                    </TabPane>
                    <TabPane tab="设置" key="set">
                        <div>
                            <Input ref="s-filter-code" onChange={this.onInputFieldChange.bind(this, 'code')} placeholder="代码" />
                        </div>
                        <div className="mt10">
                            <Radio.Group  onChange={this.onFieldChange.bind(this, 'period')} defaultValue={period} size="small">
                                <Radio.Button value="day">日</Radio.Button>
                                <Radio.Button value="week">周</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className="mt10">
                        {/* defaultValue={moment().subtract(3, 'year')} */}
                            <DatePicker  onChange={this.onDateFieldChange.bind(this, 'startDate')} placeholder="开始时间" />
                        </div>
                        <div className="mt10">
                            <DatePicker onChange={this.onDateFieldChange.bind(this, 'endDate')} placeholder="结束时间" />
                        </div>
                        <div className="mt10">
                            <Button type="primary" onClick={this.onSearchClick}>确定</Button>
                        </div>
                    </TabPane>
                    
                    
                    
                    
                </Tabs>

            </div>
        );
    }
}