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
import { Button,Select,Input  } from 'antd';
import FEvents from "../FEvent/index.js";

import {request} from "../../common/ajax.js";
import {URL, Util} from "../../common/config.js";




@FEvents
export default class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
            code:'',
            period:'day'
        };
    }

    componentDidMount() {
		
	}

	onFieldChange=(name,value)=>{

        this.setState({
            [name]:value
        },()=>{
            this.emit('chart:refresh',this.state)
        })
        
    }
	

    render() {
        const {code,period} = this.state;
        return (
            <div className="stock-filter">
                <Select  onChange={this.onFieldChange.bind(this,'period')} value={period}>
                    <Select.Option value="day">日</Select.Option>
                    <Select.Option value="week">周</Select.Option>
                </Select>
            </div>
        );
    }
}