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
            recordList: [],
            tab: 'position',
            type:''
        };
    }

    componentDidMount() {
        this.fetchGroupList();
        this.on('final:record-group-edit-finish', () => {
            this.fetchGroupList();
        })

        this.on('final:stock-quote-refresh-finish', () => {
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
                    if (d.type == 'stock') {
                        stockCodeArray.push(d.code);
                    }
                }
                Data.addCodesToStockQuote(stockCodeArray);

                self.setState({
                    groupList: groupList,
                    recordList:[]
                })
            }, {
                type: this.state.type
            }, 'jsonp')
    }

    fetchRecordList = (groupId) => {
        let { type } = this.state;
        const self = this;
        request('/record/getListByGroupId',
            (res) => {
                self.setState({
                    recordList: res.list || []
                })
            }, {
                groupId: groupId
            }, 'jsonp')
    }

    onRecordGroupEditClick = (id) => {
        this.emit('final:record-group-edit-show', { id: id })
    }

    onRecordEditClick = (id) => {
        this.emit('final:record-edit-show', { id: id })
    }

    onFilterSelectChange=(name,value)=>{
        this.setState({
            [name]:value
        },this.fetchGroupList)
    }


    onViewRecordListClick = (id) => {
        this.fetchRecordList(id);
    }

    render() {
        let { groupList, recordList,type } = this.state;
        let recordType = Dict.recordType.concat({label:'全部',value:''})
        return (
            <div>
                <div className="ml20 mt20">
                    <QuoteSwitch />
                </div>
                <div className="record-list-container">
                    <div className="list-filter">
                        <Select style={{width:'100px'}} value={type}  onChange={this.onFilterSelectChange.bind(this,'type')}>
                            {
                                recordType.map(e=>{
                                    return <Select.Option value={e.value}>{e.label}</Select.Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className="list-wrap  mt20">
                        <div className="group-list">
                            <Table size="small"
                                title={() => '操作分组'}
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
                                                <Icon className="c-p" type="edit" onClick={this.onRecordGroupEditClick.bind(this, record.id)} />
                                            </span>
                                            <span className="ml10">
                                                <Icon className="c-p" type="bars" onClick={this.onViewRecordListClick.bind(this, record.id)} />
                                            </span>
                                        </div>)
                                    }
                                }
                                ]} />
                        </div>
                        <div className="record-list">
                            <Table size="small"
                                title={() => '分组详情记录'}
                                pagination={false}
                                dataSource={recordList}
                                columns={[{
                                    title: '分组ID',
                                    dataIndex: 'groupId',
                                    key: 'groupId'
                                }, {
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
                                    title: '时间',
                                    dataIndex: 'date',
                                    key: 'date'
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
                                    title: '买卖',
                                    dataIndex: 'oper',
                                    key: 'oper',
                                    render: (text, record) => {
                                        return (<div>
                                            {Dict.recordOperMapper[record.oper]}
                                        </div>)
                                    }
                                }, {
                                    title: '开平仓',
                                    dataIndex: 'subOper',
                                    key: 'subOper',
                                    render: (text, record) => {
                                        return (<div>
                                            {Dict.recordSubOperMapper[record.subOper]}
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
                                    title: '价格',
                                    dataIndex: 'price',
                                    key: 'price'
                                }, {
                                    title: '止损价格',
                                    dataIndex: 'stopPrice',
                                    key: 'stopPrice'
                                }, {
                                    title: '剩余数量',
                                    dataIndex: 'remaining',
                                    key: 'remaining'
                                }, {
                                    title: '开仓数量',
                                    dataIndex: 'count',
                                    key: 'count'
                                }, {
                                    title: '开仓ID',
                                    dataIndex: 'openId',
                                    key: 'openId'
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
                    </div>


                    <RecordGroupEdit />
                    <RecordEdit />
                </div>

            </div>

        );
    }
}