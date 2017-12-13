import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Tabs } from 'antd';
import FEvents from "../FEvent/index.js";

import { request } from "../../common/ajax.js";
import { URL, Util } from "../../common/config.js";


const TabPane = Tabs.TabPane;

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            period: 'day',
            startDate: ''
        };
    }

    componentDidMount() {

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

    fieldChange = (name, value) => {
        this.setState({
            [name]: value
        }, this.onSearchClick)
    }

    render() {
        const { code, period } = this.state;
        return (
            <div className="s-filter">
                <Tabs onChange={this.onTabChange} type="card" size="small">
                    <TabPane tab="设置" key="set">
                        <div>
                            <Input ref="s-filter-code" onChange={this.onInputFieldChange.bind(this, 'code')} placeholder="代码" />
                        </div>
                        <div>
                            <Select onChange={this.onFieldChange.bind(this, 'period')} value={period}>
                                <Select.Option value="day">日</Select.Option>
                                <Select.Option value="week">周</Select.Option>
                            </Select>
                        </div>
                        <div>
                            <DatePicker defaultValue={moment().subtract(3, 'year')} onChange={this.onDateFieldChange.bind(this, 'startDate')} placeholder="开始时间" />
                        </div>
                        <div>
                            <DatePicker onChange={this.onDateFieldChange.bind(this, 'endDate')} placeholder="结束时间" />
                        </div>
                    </TabPane>
                    <TabPane tab="业绩报告列表" key="report-list">
                        业绩报告列表
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}