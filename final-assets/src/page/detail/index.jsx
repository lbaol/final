import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "components/Common/FEvent/index.js";
import ListFilter from "components/Filter/ListFilter/index.jsx";
import MainChart from "components/Chart/MainChart/index.jsx";
import StockChart from "components/Chart/StockChart/index.jsx";
import BaseInfo from "components/BaseInfo/index.jsx";
import FilterSetting from "components/Filter/FilterSetting/index.jsx";
import {Env} from "common/config.js";
import { request } from "common/ajax.js";
import { LocaleProvider  } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import urlParse from "url-parse";
import 'common/base.scss';
import './index.scss';

const urlQuery = urlParse(location.href, true).query;

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
        this.emit('final:show-the-stock',{code:urlQuery.code})
        
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
                    <div className="main-content">
                        <FilterSetting/>
                        <StockChart />
                    </div>
                    <div  className="right-content">
                        <BaseInfo/>
                        <ListFilter stockDict={this.state.stockDict}/>
                    </div>
                </div>
            </LocaleProvider>
            
        );
    }
}