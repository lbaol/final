import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Tabs, Table,Pagination ,Radio} from 'antd';
import FEvents from "../FEvent/index.js";

import { request } from "../../common/ajax.js";
import { URL, Util } from "../../common/config.js";
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
           code:'',
           baseInfo:{}
        };
    }

    componentDidMount() {
        this.on('final:base-info-refresh', (data) => {
            console.log("data",data)
            this.setState({
                code:data.code
            },this.fatchBaseInfo)
            
        });
    }

    fatchBaseInfo=()=>{
        const self = this;
        const {code} = this.state;
        request('/stock/getByCode',
		(res)=>{

            
            let eventList = res.eventList;

            eventList = _.orderBy(eventList, ['eventDate'], ['desc']);
            res.eventList = eventList;

			self.setState({
                baseInfo:res
            })
		},{
            code:code
        },'jsonp')
    }
    

    render() {
        const {baseInfo} = this.state;
        const baisc = baseInfo.baisc;

        return (
            
            <div className="base-info">
                <div>
                    {baisc && baisc.code} {baisc && baisc.name}   
                </div>
                {
                    baseInfo.eventList && baseInfo.eventList.map((rep)=>{
                        return <div className="mt5">
                            <span className="mr5">{rep.eventDate}</span>  
                                {rep.type=='report'&& <span><span className="c-blue">{rep.quarter}季度 报告</span> <span>{rep.profitsYoy}%</span></span>}
                                {rep.type=='forecast'&& <span><span className="c-green">{rep.quarter}季度 预告</span> <span>{_.includes(rep.ranges,'%')?rep.ranges:(rep.ranges+'%')}</span></span> }
                        </div>
                    })
                }
            </div>
        );
    }
}