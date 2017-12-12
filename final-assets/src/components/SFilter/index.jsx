import React, {Component} from 'react';
import ReactDOM from 'react-dom';
// 引入 ECharts 主模块
import * as echarts from 'echarts';
// 引入candlestick图
import  'echarts/lib/chart/candlestick';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import _ from 'lodash';
import fecha from 'fecha';
import { Button,Select,Input,DatePicker  } from 'antd';
import FEvents from "../FEvent/index.js";

import {request} from "../../common/ajax.js";
import {URL, Util} from "../../common/config.js";




@FEvents
export default class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
            code:'',
            period:'day',
            startDate:''
        };
    }

    componentDidMount() {
		
	}

	onFieldChange=(name,value)=>{
        this.fieldChange(name,value);
    }

    onInputFieldChange=(name)=>{
        let value = ReactDOM.findDOMNode(this.refs['s-filter-'+name]).value;
        this.fieldChange(name,value);
    }

    onDateFieldChange=(name,value,valueString)=>{
        this.fieldChange(name,valueString);
    }

    onSearchClick=()=>{
        this.emit('chart:refresh',this.state)
    }
    
    fieldChange=(name,value)=>{
        this.setState({
            [name]:value
        })
    }

    render() {
        const {code,period} = this.state;
        return (
            <div className="s-filter">
                <div>
                    <Input ref="s-filter-code" onChange={this.onInputFieldChange.bind(this,'code')} placeholder="代码" />
                </div>
                <div>
                    <Select  onChange={this.onFieldChange.bind(this,'period')} value={period}>
                        <Select.Option value="day">日</Select.Option>
                        <Select.Option value="week">周</Select.Option>
                    </Select>
                </div>
                <div>
                    <DatePicker onChange={this.onDateFieldChange.bind(this,'startDate')}  placeholder="开始时间"/>
                </div>
                <div>
                    <DatePicker onChange={this.onDateFieldChange.bind(this,'endDate')}  placeholder="结束时间"/>
                </div>
                <div>
                    <Button type="primary" onClick={this.onSearchClick}>确定</Button>
                </div>
            </div>
        );
    }
}