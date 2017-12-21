import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "../FEvent/index.js";
import StockFilter from "../StockFilter/index.jsx";
import MainChart from "../MainChart/index.jsx";
import BaseInfo from "../BaseInfo/index.jsx";
import SetFilter from "../SetFilter/index.jsx";
import {Env} from "../../common/config.js";
import { LocaleProvider  } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import '../../common/base.scss';
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const {code} = this.state;
        this.emit('final:first-init')
    }

    

    render() {
        
        return (
            <LocaleProvider locale={zhCN}>
            
                <div className={"page-wrap "+"page-wrap-"+Env}>
                    <div className="left-nav">
                        <StockFilter />
                    </div>
                    <div className="main-content">
                        <SetFilter/>
                        <MainChart />
                    </div>
                    <div  className="right-content">
                        <BaseInfo/>
                    </div>
                </div>
            </LocaleProvider>
            
        );
    }
}