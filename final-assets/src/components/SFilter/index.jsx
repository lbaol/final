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

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            period: 'day',
            startDate: '',
            reportList: []
        };
    }

    componentDidMount() {
        this.fatchReportList()
    }

    fatchReportList = () => {
        const self = this;
        request('/stock/getReports',
            (res) => {
                let reportList = res.reportList;
                let forecastList = res.forecastList;
                let increaseList = [];
                let otherList = [];
                let allList = [];
                let i = 0;
                for (let d1 of reportList) {
                    d1.key = i++;
                    allList.push(d1);
                    if (d1.profitsYoy > 0) {
                        increaseList.push(d1)
                    } else {
                        otherList.push(d1)
                    }
                }
                for (let d2 of forecastList) {
                    d2.key = i++;
                    allList.push(d2);
                    if (d2.ranges.indexOf('-') >= 0) {
                        otherList.push(d2)
                    } else {
                        increaseList.push(d2)
                    }
                }

                _reportList.increaseList = _.orderBy(increaseList, ['reportDate'], ['desc']);
                _reportList.otherList = _.orderBy(otherList, ['reportDate'], ['desc']);
                _reportList.allList = _.orderBy(allList, ['reportDate'], ['desc']);

                
                
                self.setState({
                    reportList: _reportList.allList
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
        }, this.onSearchClick)
    }

    onShowResultChange=(e)=>{
        this.setState({
            reportList:_reportList[e.target.value]
        })
    }

    render() {
        const { code, period, reportList } = this.state;
        const pagination = {
            otal:reportList.length,
            pageSize:5
        }
        return (
            <div className="s-filter">
                <Tabs onChange={this.onTabChange} type="card" size="small">
                    
                    <TabPane tab="业绩列表"  key="report-list">
                        <div>
                            <Radio.Group  onChange={this.onShowResultChange} defaultValue="allList" size="small">
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
                    <TabPane tab="设置" key="set">
                        <div>
                            <Input ref="s-filter-code" onChange={this.onInputFieldChange.bind(this, 'code')} placeholder="代码" />
                        </div>
                        <div className="mt10">
                            <Select onChange={this.onFieldChange.bind(this, 'period')} value={period}>
                                <Select.Option value="day">日</Select.Option>
                                <Select.Option value="week">周</Select.Option>
                            </Select>
                        </div>
                        <div className="mt10">
                            <DatePicker defaultValue={moment().subtract(3, 'year')} onChange={this.onDateFieldChange.bind(this, 'startDate')} placeholder="开始时间" />
                        </div>
                        <div className="mt10">
                            <DatePicker onChange={this.onDateFieldChange.bind(this, 'endDate')} placeholder="结束时间" />
                        </div>
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}