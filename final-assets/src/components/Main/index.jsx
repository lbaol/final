import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "../FEvent/index.js";
import SFilter from "../SFilter/index.jsx";
import SChart from "../SChart/index.jsx";
import BaseInfo from "../BaseInfo/index.jsx";
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
           code:'002008'
        };
    }

    componentDidMount() {
        const {code} = this.state;
        this.emit('final:first-init',{code:code})
    }

    

    render() {
        
        return (
            <LocaleProvider locale={zhCN}>
            
                <div className={"page-wrap "+"page-wrap-"+Env}>
                    <div className="left-nav">
                        {/* <SFilter /> */}
                    </div>
                    <div className="main-content">
                        <SChart />
                    </div>
                    <div  className="right-content">
                        <BaseInfo/>
                    </div>
                </div>
            </LocaleProvider>
            
        );
    }
}