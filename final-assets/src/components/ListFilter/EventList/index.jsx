import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input,Icon, DatePicker, Tabs, Table,Pagination ,Radio} from 'antd';
import FEvents from "../../FEvent/index.js";

import { request } from "../../../common/ajax.js";
import { URL, Util,Dict } from "../../../common/config.js";
import './index.scss';




@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventList: [],
            currentEventType:'leadNewHigh'
        };
    }

    componentDidMount() {
        this.fatchEventList();
    }

    

    fatchEventList = () => {
        const self = this;
        const {currentEventType} = this.state;
        request('/event/getByType',
            (res) => {
                
                self.setState({
                    eventList: res.eventList
                })

            }, {
                type:currentEventType
            }, 'jsonp')
    }


    onStockItemClick=(code)=>{
        this.emit('final:show-the-stock',{
            ...this.state,
            code:code
        })
    }


    onEventTypeChange=(e)=>{
        this.setState({
            currentEventType:e.target.value
        },this.fatchEventList)
    }

    onAddFavClick=(code)=>{
        this.emit('final:fav-edit-show',{
            code:code
        })
    }

    render() {
        const { code, period, eventList,currentEventType } = this.state;
        const {stockDict} = this.props;
        const pagination = {
            otal:eventList.length,
            pageSize:100
        }
        return (
            <div>
                <div>
                    <Radio.Group  onChange={this.onEventTypeChange} value={currentEventType} size="small">
                        {
                            Dict.eventType.map((e)=>{
                                return <Radio.Button value={e.value}>{e.label}</Radio.Button>
                            })
                        }
                    </Radio.Group>
                </div>
                <div className="mt10">
                    <Table size="small" className="event-list-table"
                        pagination={pagination}
                        dataSource={eventList}
                        scroll={{ x: true, y: 300 }}
                        columns={[{
                            title: '名称',
                            dataIndex: 'name',
                            key:'name',
                            render: (text, record) => {
                                let stock = stockDict[record.code];
                                return (
                                    <span className="c-p" onClick={this.onStockItemClick.bind(this,record.code)}>
                                        {stock && stock.name}
                                    </span>)
                            }
                        }, {
                            title: '日期',
                            dataIndex: 'eventDate',
                            key:'eventDate'
                        }]}  />
                </div>
                        

            </div>
        );
    }
}