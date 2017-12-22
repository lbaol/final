import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "../FEvent/index.js";
import ListFilter from "../ListFilter/ListFilter/index.jsx";
import MainChart from "../MainChart/index.jsx";
import BaseInfo from "../BaseInfo/index.jsx";
import FilterSet from "../FilterSet/index.jsx";
import {Env} from "../../common/config.js";
import { request } from "../../common/ajax.js";
import { LocaleProvider  } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import '../../common/base.scss';
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stockDict:{}
        };
    }

    componentDidMount() {
        
        this.fatchAllStock();
        this.emit('final:first-init')
        
    }

    fatchAllStock=()=>{
        const self = this;
        request('/stock/getAll',
        (res)=>{
            let stockDict = {}
            for(let st of res){
                stockDict[st.code] = st
            }
            this.setState({
                stockDict:stockDict
            })
        },{
        },'jsonp')
    }

    

    render() {
        
        return (
            <LocaleProvider locale={zhCN}>
            
                <div className={"page-wrap "+"page-wrap-"+Env}>
                    <div className="left-nav">
                        <ListFilter stockDict={this.state.stockDict}/>
                    </div>
                    <div className="main-content">
                        <FilterSet/>
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