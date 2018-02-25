import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider ,List } from 'antd';
import {Env} from "common/config.js";
import { request2 } from "common/ajax.js";
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
            <LocaleProvider locale={zhCN}>
                <div className={"page-wrap "+"page-wrap-"+Env}>
                <List bordered
                    >
                    <List.Item><a target="_blank" href="/detail.html">详情</a></List.Item>
                    <List.Item><a target="_blank" href="/alert.html">alert</a></List.Item>
                    <List.Item><a target="_blank" href="/setting.html">设置</a></List.Item>
                    <List.Item><a target="_blank" href="/record.html">交易记录</a></List.Item>
                </List>
                </div>
            </LocaleProvider>
            
        );
    }
}