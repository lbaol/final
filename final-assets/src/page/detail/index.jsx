import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "components/Common/FEvent/index.js";
import ListFilter from "components/Filter/ListFilter/index.jsx";
import MainChart from "components/Chart/MainChart/index.jsx";
import StockChart from "components/Chart/StockChart/index.jsx";
import BaseInfo from "components/BaseInfo/index.jsx";
import FilterSetting from "components/Filter/FilterSetting/index.jsx";
import SliderRight from "components/Common/SliderRight/index.jsx";
import EventList from "components/Event/EventList/index.jsx";
import {Env} from "common/config.js";
import { request } from "common/ajax.js";
import { LocaleProvider,Icon  } from 'antd';
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
            visibleRight:false,
            code:urlQuery.code?urlQuery.code:'002008',
            codes:urlQuery.codes?urlQuery.codes:['002008']
        };
    }

    componentDidMount() {
        
        this.fatchAllStock();

        this.on('final:show-the-stock', (data) => {
            this.refresh(data)
        });

        this.on('final:stock-chart-refresh', (data) => {
            this.refresh(data)
        });
        
    }

    refresh=(data)=>{
        if(!data || !data.code){
            return;
        }
        this.setState({
            codes: [].push(data.code)
        })
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
                            {/* <div>
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
                        <div  className={'right-content '+(visibleRight==true?'normal':'hidden')}>
                            
                            
                        </div>
                    </div>
                    <SliderRight>
                        {
                            codes.map((code)=>{
                                return <EventList  code={code} />
                            })
                        }
                        
                        <ListFilter stockDict={this.state.stockDict}/>
                    </SliderRight>
                </div>
            </LocaleProvider>
            
        );
    }
}