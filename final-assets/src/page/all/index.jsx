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
            
                
            <List bordered>
                <List.Item><Link to="/record_list">交易记录</Link></List.Item>
            </List>
            
            
        );
    }
}