import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider ,List } from 'antd';
import {Env} from "common/config.js";
import { request2 } from "common/ajax.js";
import { Link } from 'react-router'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'common/base.scss';






export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    componentDidMount() {
        
    }

    
    

    render() {
        
        return (
            
            <div>
                    
            <List bordered>
                <List.Item><Link to="/position_list">持仓</Link></List.Item>
                <List.Item><Link to="/record_group_list">交易分组列表</Link></List.Item>
                <List.Item><Link to="/close_record_analysis">卖出分析</Link></List.Item>
                <List.Item><Link to="/open_record_analysis">买入分析</Link></List.Item>
            </List>
            
            </div>
            
            
        );
    }
}