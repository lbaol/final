import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "components/Common/FEvent/index.js";
import CloseRecordAnalysis from "components/Record/CloseRecordAnalysis/index.jsx";
import {Env} from "common/config.js";
import { request } from "common/ajax.js";
import { LocaleProvider  } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'common/base.scss';



@FEvents
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
                    <CloseRecordAnalysis />
                </div>
            </LocaleProvider>
            
        );
    }
}