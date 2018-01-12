import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "components/Common/FEvent/index.js";
import ListFilter from "components/Filter/ListFilter/index.jsx";
import MainChart from "components/Chart/MainChart/index.jsx";
import StockChart from "components/Chart/StockChart/index.jsx";
import BaseInfo from "components/BaseInfo/index.jsx";
import FilterSetting from "components/Filter/FilterSetting/index.jsx";
import SliderLeft from "components/Common/SliderLeft/index.jsx";
import SliderRight from "components/Common/SliderRight/index.jsx";
import EventList from "components/Event/EventList/index.jsx";
import {Env} from "common/config.js";
import { request } from "common/ajax.js";
import { LocaleProvider,Icon,Affix,Button  } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import urlParse from "url-parse";
import { Config } from "common/config.js";

import 'common/base.scss';
import './index.scss';

const urlQuery = urlParse(location.href, true).query;

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stockDict:{},
            codes:urlQuery.codes?urlQuery.codes:['603338']
        };
    }

    componentDidMount() {
        
        this.fatchAllStock();

        this.on('final:detail-show-stocks', (data) => {
            if(!data || (!data.code && !data.codes)){
                return;
            }
            let codes = [];
            if(data.code){
                codes.push(data.code)
            }
            if(data.codes){
                codes = data.codes;
            }
            this.setState({
                codes: codes
            })
        });


       
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

    rightContentSwitchClick=()=>{
        let {visibleRight} = this.state;
        this.setState({
            visibleRight:!visibleRight
        })
    }

    

    render() {
        let {codes,visibleRight} = this.state;
        return (
            <LocaleProvider locale={zhCN}>
            
                <div className={"page-wrap "+"page-wrap-"+Env}>
                    <div  className="page-content">
                        <div className="main-content">
                            {/* <FilterSetting/> */}
                            {/* <div className="chart-wrap">
                                <StockChart type="index" code="SH000016" />
                            </div> */}
                            {
                                codes.map((code)=>{
                                    return <div>
                                        <div>
                                            <BaseInfo code={code}/>
                                        </div>
                                        <div>
                                            <div className="chart-wrap">
                                                <StockChart code={code} needCheckEvent={true}/>
                                            </div>
                                            <div className="chart-wrap">
                                                <StockChart code={code} period="week" defaultRangeSelector={2} />
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                            
                            
                        </div>
                    </div>
                    <SliderRight>
                        {
                            codes.map((code)=>{
                                return <EventList  code={code} />
                            })
                        }
                        
                        
                    </SliderRight>
                    <SliderLeft>
                        <ListFilter stockDict={this.state.stockDict}/>
                    </SliderLeft>
                </div>
            </LocaleProvider>
            
        );
    }
}