import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import {Input,Table,Select,DatePicker,Button,Icon} from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import { request } from "common/ajax.js";
import { URL, Util ,Dict} from "common/config.js";



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
           list:[],
           code:'',
           market:'SH',
           startDate:moment().format('YYYY-MM-DD'),
           endDate:moment().format('YYYY-MM-DD')
        };
    }

    componentWillMount(){
        this.fatchList()
    }


    fatchList=()=>{
        const self = this;
        const {code,type} = this.state;
        request('/indexPeriod/getAll',
		(res)=>{
			self.setState({
                list:res.list
            })
		},{
        },'jsonp')
    }
    

    onDateFieldChange=(key,value, valueString)=>{
        this.setState({
            [key]:valueString
        })
    }

    onCodeChange=(e)=>{
        this.setState({
            code:_.trim(e.target.value)
        })
    }

    onMarketChange=(value)=>{
        this.setState({
            market:value
        })
    }

    onAddClick=()=>{
        const self = this;
        const {code,market,startDate,endDate} = this.state;
        request('/indexPeriod/save',
            (res) => {
                self.fatchList()
            }, {
                startDate,
                endDate,
                market,
                code
            }, 'jsonp')
    }

    onTableDateFieldChange=(id,key,value, valueString)=>{
        const self = this;
        const {list} = this.state;
        const i = _.findIndex(list,{id:id});
        if(i>-1){
            list[i][key] = valueString;
        }
    }

    onEditClick=(id)=>{
        const self = this;
        const {list} = this.state;
        const i = _.findIndex(list,{id:id});
        if(i>-1){
            request('/indexPeriod/save',
                (res) => {
                    self.fatchList()
                }, {
                    ...list[i]
                }, 'jsonp')
        }
    }
   

    render() {
        let {list,startDate,endDate,code,market} = this.state;
        return (
            <div>
                <div>
                    <span>
                        <Input size="small" style={{width:'110px'}} placeholder="code" onChange={this.onCodeChange}/>
                    </span>
                    <span class="ml10">
                        <DatePicker  style={{width:'110px'}} size="small" value={startDate ? moment(startDate, 'YYYY-MM-DD'):moment()} onChange={this.onDateFieldChange.bind(this,'startDate')} placeholder="开始日期" />
                    </span>
                    <span class="ml10">
                        <DatePicker  style={{width:'110px'}} size="small" value={endDate ? moment(endDate, 'YYYY-MM-DD'):moment()} onChange={this.onDateFieldChange.bind(this,'endDate')} placeholder="结束日期" />
                    </span>
                    <span class="ml10">
                        <Select  style={{width:'70px'}} size="small" value={market}  onChange={this.onMarketChange}>
                            {
                                Dict.marketType.map(d=><Select.Option value={d.value}>{d.label}</Select.Option>)
                            }
                        </Select>
                    </span>
                    <span class="ml10">
                        <Button size="small" type="primary" onClick={this.onAddClick}>新增</Button>
                    </span>
                </div>
                <div className="mt20">
                    <Table size="small" 
                            pagination={false}
                            dataSource={list}
                            columns={[{
                                title: '代码',
                                dataIndex: 'code',
                                key:'code'
                            }, {
                                title: '全码',
                                dataIndex: 'fullCode',
                                key:'fullCode'
                            }, {
                                title: '名称',
                                dataIndex: 'fullCode',
                                key:'name',
                                render: (text, record) => {
                                    return Dict.indexTypeMapper[text]
                                }
                            },{
                                title: '开始日期',
                                dataIndex: 'startDate',
                                key:'startDate',
                                render: (text, record) => {
                                    return (<DatePicker  
                                        style={{width:'110px'}} 
                                        size="small" 
                                        value={text && moment(text, 'YYYY-MM-DD')} 
                                        onChange={this.onTableDateFieldChange.bind(this,record.id,'startDate')} 
                                        placeholder="开始日期" />)
                                }
                            }, {
                                title: '结束日期',
                                dataIndex: 'endDate',
                                key:'endDate',
                                render: (text, record) => {
                                    return (<DatePicker  
                                        style={{width:'110px'}} 
                                        size="small" 
                                        value={text && moment(text, 'YYYY-MM-DD')} 
                                        onChange={this.onTableDateFieldChange.bind(this,record.id,'endDate')} 
                                        placeholder="结束日期" />)
                                }
                            }, {
                                title: '操作',
                                dataIndex: 'oper',
                                key:'oper',
                                render: (text, record) => {
                                    return (<Icon className="c-p" type="edit" onClick={this.onEditClick.bind(this,record.id)} />)
                                }
                            }]}  />
                </div>
            </div>
        );
    }
}