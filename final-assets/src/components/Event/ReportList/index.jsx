import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Tabs, Table,Pagination ,Radio} from 'antd';
import FEvents from "components/Common/FEvent/index.js";

import { request } from "common/ajax.js";
import { URL, Util } from "common/config.js";
import './index.scss';


let _eventList = {
    allList : [],
    increaseList : [],
    otherList : []
}


@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            reportList: [],
            defaultReportList:'increaseList'
        };
    }

    componentDidMount() {
        this.fatchAllEventList();

        this.on('final:report-list-refresh',()=>{
            this.fatchAllEventList();
        })
    }

    

    fatchAllEventList = () => {
        const self = this;
        const {defaultReportList} = this.state;
        request('/event/getAll',
            (res) => {
                
                let allList = res.eventList;
                let increaseList = [];
                let otherList = [];
                const afterDate = '20170601'
                
                let i = 0;
                for (let d of allList) {
                    let st = self.props.stockDict[d.code];
                    d.key = i++;
                    if(d.type == 'report'){
                        if (d.profitsYoy <= 0 || (st && st.timeToMarket > afterDate)) {
                            otherList.push(d)
                        } else {
                            increaseList.push(d)
                        }
                    }
                    if(d.type == 'forecast'){
                        if (d.ranges.indexOf('-') >= 0 ||d.ranges== 0 || (st && st.timeToMarket > afterDate)) {
                            otherList.push(d)
                        } else {
                            increaseList.push(d)
                        }
                    }
                    
                }

                _eventList.increaseList = _.orderBy(increaseList, ['eventDate'], ['desc']);
                _eventList.otherList = _.orderBy(otherList, ['eventDate'], ['desc']);
                _eventList.allList = _.orderBy(allList, ['eventDate'], ['desc']);
                
                
                self.setState({
                    reportList: _eventList[defaultReportList]
                })

            }, {
            }, 'jsonp')
    }


    onStockItemClick=(code)=>{
        this.emit('final:detail-show-stocks',{
            code:code
        })
    }


    onShowResultChange=(e)=>{
        this.setState({
            reportList:_eventList[e.target.value]
        })
    }

    render() {
        const { code, period, reportList,defaultReportList } = this.state;
        const pagination = {
            otal:reportList.length,
            pageSize:100
        }
        return (
            <div>
                <div>
                    <Radio.Group  onChange={this.onShowResultChange} defaultValue={defaultReportList} size="small">
                        <Radio.Button value="allList">全部</Radio.Button>
                        <Radio.Button value="increaseList">增长</Radio.Button>
                        <Radio.Button value="otherList">其他</Radio.Button>
                    </Radio.Group>
                </div>
                <div className="mt10">
                    <Table size="small" className="report-list-table"
                        pagination={pagination}
                        dataSource={reportList}
                        scroll={{ x: true, y: 300 }}
                        columns={[{
                            title: '名称',
                            dataIndex: 'name',
                            key:'name',
                            render: (text, record) => (
                                <span className="c-p" onClick={this.onStockItemClick.bind(this,record.code)}>
                                    {text}
                                </span>
                            )
                        }, {
                            title: '日期',
                            dataIndex: 'eventDate',
                            key:'eventDate'
                        },{
                            title: '类型',
                            dataIndex: 'type',
                            key:'type',
                            render: (text, record) => {
                                return (<div>
                                    {text=='report' && <span className="c-blue">报告</span>}
                                    {text=='forecast' &&  <span className="c-green">预告</span>}
                                </div>)
                                
                            }
                        },{
                            title: '业绩',
                            key:'key1',
                            render: (text, record) => (
                                <span>
                                    {record.type == 'report' && (record.profitsYoy+'%')}
                                    {record.type == 'forecast' && record.ranges}
                                </span>
                            ),
                        }]}  />
                </div>
                        

            </div>
        );
    }
}