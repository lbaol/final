import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Input, Select, Collapse, Icon, DatePicker, Tabs, Table, Pagination, Radio, Modal, Tag } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import RecordGroupEdit from "components/Record/RecordGroupEdit/index.jsx";
import RecordEdit from "components/Record/RecordEdit/index.jsx";
import QuoteSwitch from "components/Common/QuoteSwitch/index.jsx";
import { request } from "common/ajax.js";
import { URL, Util, Dict, Config, Data } from "common/config.js";
import './index.scss';




@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupList: [],
            tab: 'position'
        };
    }

    componentDidMount() {
        this.fetchGroupList();
        this.on('final:record-group-edit-finish', () => {
            this.fetchGroupList();
        })

        this.on('final:stock-quote-refresh-finish',()=>{
            this.fetchGroupList();
        })
    }

    fetchGroupList = () => {
        let { type } = this.state;
        const self = this;
        request('/recordGroup/getList',
            (res) => {
                let groupList = res.list;
                let stockCodeArray = [];
                for (let d of groupList) {
                    if(d.type == 'stock'){
                        stockCodeArray.push(d.code);
                    }
                }
                Data.addCodesToStockQuote(stockCodeArray);

                self.setState({
                    groupList: groupList
                })
            }, {
                market: this.props.market,
                type: this.props.type
            }, 'jsonp')
    }

    onRecordEditClick = (id) => {
        this.emit('final:record-group-edit-show', { id: id })
    }

    render() {
        let { groupList } = this.state;
        return (
            <div className="record-list-container">
                <div className="ml20 mt20">
                    <QuoteSwitch/>
                </div>
                <div className="mt30 mb30 ml20 record-list">
                    <Table size="small"
                        title={() => '操作记录'}
                        pagination={false}
                        dataSource={groupList}
                        columns={[{
                            title: 'ID',
                            dataIndex: 'id',
                            key: 'id'
                        }, {
                            title: '名称',
                            dataIndex: 'name',
                            key: 'name',
                            render: (text, record) => {
                                let quote = Data.getStockQuote(record.code);
                                return (<div>
                                    {quote && quote.name}
                                </div>)
                            }
                        }, {
                            title: '代码',
                            dataIndex: 'code',
                            key: 'code'
                        }, {
                            title: '开始时间',
                            dataIndex: 'startDate',
                            key: 'startDate'
                        }, {
                            title: '结束时间',
                            dataIndex: 'endDate',
                            key: 'endDate'
                        }, {
                            title: '类型',
                            dataIndex: 'type',
                            key: 'type',
                            render: (text, record) => {
                                return (<div>
                                    {Dict.recordTypeMapper[record.type]}
                                </div>)
                            }
                        }, {
                            title: '方向',
                            dataIndex: 'direction',
                            key: 'direction',
                            render: (text, record) => {
                                return (<div>
                                    {Dict.recordDirectionMapper[record.direction]}
                                </div>)
                            }
                        }, {
                            title: '市场',
                            dataIndex: 'market',
                            key: 'market',
                            render: (text, record) => {
                                return (<div>
                                    {Dict.marketTypeMapper[record.market]}
                                </div>)
                            }
                        }, {
                            title: '开仓数量',
                            dataIndex: 'count',
                            key: 'count'
                        }, {
                            title: '状态',
                            dataIndex: 'status',
                            key: 'status',
                            render: (text, record) => {
                                return (<div>
                                    {Dict.recordStatusMapper[record.status]}
                                </div>)
                            }
                        }, {
                            title: '操作',
                            dataIndex: 'oper',
                            key: 'oper',
                            render: (text, record) => {
                                return (<div>
                                    <span>
                                        <Icon className="c-p" type="edit" onClick={this.onRecordEditClick.bind(this, record.id)} />
                                    </span>
                                </div>)
                            }
                        }
                        ]} />
                </div>

                <RecordGroupEdit />
                <RecordEdit />
            </div>
        );
    }
}