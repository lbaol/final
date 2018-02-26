import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Modal,Form } from 'antd';
import FEvents from "components/Common/FEvent/index.js";

import { request } from "common/ajax.js";
import { URL, Util,Dict } from "common/config.js";

const FormItem = Form.Item;


@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:'',
            code:'',
            cost:'',
            startDate:'',
            endDate:'',
            number:'',
            status:'',
            market:'',  // a 大陆a股; hk 香港;us 美股;
            type:'',    //stock 股票; futures 期货;
            visible: false
        };
    }

    componentDidMount() {
        this.on('final:record-group-edit-show', (data) => {
            this.setState({
                id:data && data.id?data.id:'',
                startDate:'',
                endDate:'',
                number:'',
                code:'',
                cost:'',
                status:'',
                market:'',
                type:'',
                visible: true
            },this.fetchData);
        });
    }

    fetchData=()=>{
        let {id} = this.state;
        if(id){
            request('/recordGroup/getById',
            (res)=>{
                if(res){
                    this.setState({
                        ...res
                    })
                }
            },{
                ...this.state
            },'jsonp')
        }
        
    }
    
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onInputChange=(name,e)=>{
        this.setState({
            [name]:e.target.value
        })
    }
   

    onDateFieldChange=(name,value, valueString)=>{
        this.setState({
            [name]:valueString
        })
    }

    onSaveClick=()=>{
        const self = this;
        request('/recordGroup/save',
		(res)=>{
            self.setState({visible:false})
            self.emit('final:record-group-edit-finish')
		},{
            ...this.state
        },'jsonp')
    }

    onSelectChange=(name,value)=>{
        this.setState({
            [name]:value
        })
    }

    render() {
        const {number,startDate,endDate,id,code,cost,status,market,type} = this.state;
        const formItemLayout = {
            labelCol: {
              sm: { span: 6 },
            },
            wrapperCol: {
              sm: { span: 18 },
            },
          };
        // console.log(type,date)
        return (
            <div>
                <Modal
                    title={id?'修改交易记录分组':'新增交易记录分组'}
                    visible={this.state.visible}
                    onOk={this.onSaveClick}
                    onCancel={this.handleCancel}
                >
                    <FormItem className="required"
                        {...formItemLayout}
                        label="代码"
                    >
                        <Input value={code} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'code')}/>
                    </FormItem>
                    <FormItem className="required"
                        {...formItemLayout}
                        label="开始日期"
                    >
                        <DatePicker value={startDate && moment(startDate)} onChange={this.onDateFieldChange.bind(this,'startDate')} placeholder="开始日期" />
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="数量"
                    >
                        <Input value={number} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'number')}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="成本"
                    >
                        <Input value={cost} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'cost')}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="结束日期"
                    >
                        <DatePicker value={endDate && moment(endDate)} onChange={this.onDateFieldChange.bind(this,'endDate')} placeholder="结束日期" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        <Select style={{width:'165px'}} value={status}  onChange={this.onSelectChange.bind(this,'status')}>
                            <Select.Option value="">进行中</Select.Option>
                            <Select.Option value="finish">结束</Select.Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="类型"
                    >
                        <Select style={{width:'165px'}} value={type}  onChange={this.onSelectChange.bind(this,'type')}>
                            {
                                Dict.recordType.map(e=>{
                                    return <Select.Option value={e.value}>{e.label}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="市场"
                    >
                        <Select style={{width:'165px'}} value={market}  onChange={this.onSelectChange.bind(this,'market')}>
                            {
                                Dict.marketType.map(e=>{
                                    return <Select.Option value={e.value}>{e.label}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                </Modal>
            </div>
        );
    }
}

