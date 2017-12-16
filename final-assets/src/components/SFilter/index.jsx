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


let _reportList = {
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

    filteStocks=(res)=>{
        
        let reportList = res.reportList;
        let forecastList = res.forecastList;
        let increaseList = [];
        let otherList = [];
        let allList = [];
        let i = 0;
        for (let d1 of reportList) {
            let st1 = _allStocksMap[d1.code];
            d1.key = i++;
            allList.push(d1);
            if (d1.profitsYoy <= 0 || (st1 && st1.timeToMarket > 20170601)) {
                otherList.push(d1)
            } else {
                increaseList.push(d1)
            }
        }
        for (let d2 of forecastList) {
            let st2 = _allStocksMap[d2.code];
            d2.key = i++;
            allList.push(d2);
            if (d2.ranges.indexOf('-') >= 0 || d2.ranges== 0 || (st2 && st2.timeToMarket > 20170601)) {
                otherList.push(d2)
            } else {
                increaseList.push(d2)
            }
        }

        _reportList.increaseList = _.orderBy(increaseList, ['reportDate'], ['desc']);
        _reportList.otherList = _.orderBy(otherList, ['reportDate'], ['desc']);
        _reportList.allList = _.orderBy(allList, ['reportDate'], ['desc']);

        

    }

    fatchReportList = () => {
        const self = this;
        const {defaultReportList} = this.state;
        request('/stock/getReports',
            (res) => {
                
                self.filteStocks(res)
                
                
                self.setState({
                    reportList: _reportList[defaultReportList]
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
            reportList:_reportList[e.target.value]
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
                    <TabPane tab="设置" key="1">
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
                                        <span onClick={this.onShowChartClick.bind(this,record.code)}>
                                            {text}
                                        </span>
                                    )
                                }, {
                                    title: '日期',
                                    dataIndex: 'reportDate',
                                    key:'reportDate'
                                },{
                                    title: '业绩',
                                    key:'key1',
                                    render: (text, record) => (
                                        <span>
                                            {record.ranges || record.profitsYoy}
                                        </span>
                                    ),
                                }]}  />
                        </div>
                        
                    </TabPane>
                    
                    
                    
                </Tabs>

            </div>
        );
    }
}