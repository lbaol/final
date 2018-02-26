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
            date:'',
            count:'',
            stopPrice:'',
            direction:'',
            groupId:'',
            price:'',
            market:'',
            type:'',
            oper:'',
            visible: false
        };
    }

    componentDidMount() {
        this.on('final:record-edit-show', (data) => {
            this.setState({
                id:data && data.id?data.id:'',
                groupId:data && data.groupId?data.groupId:'',
                code:data && data.code?data.code:'',
                market:data && data.market?data.market:'',
                type:data && data.type?data.type:'',
                date:'',
                count:'',
                stopPrice:'',
                direction:'',
                price:'',
                oper:'',
                visible: true
            },this.fetchData);
        });
    }

    fetchData=()=>{
        let {id} = this.state;
        if(id){
            request('/record/getById',
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
   

    onDateFieldChange=(value, valueString)=>{
        this.setState({
            date:valueString
        })
    }

    onSelectChange=(name,value)=>{
        this.setState({
            [name]:value
        })
    }

    onSaveClick=()=>{
        const self = this;
        request('/record/save',
		(res)=>{
            self.setState({visible:false})
            self.emit('final:record-edit-finish')
		},{
            ...this.state
        },'jsonp')
    }

    render() {
        const {id,code,count,date,price,stopPrice,fee,direction,market,type,oper} = this.state;
        const formItemLayout = {
            labelCol: {
              sm: { span: 6 },
            },
            wrapperCol: {
              sm: { span: 18 },
            },
          };
        return (
            <div>
                <Modal
                    title={id?'修改持仓':'新增持仓'}
                    visible={this.state.visible}
                    onOk={this.onSaveClick}
                    onCancel={this.handleCancel}
                >
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
                    <FormItem className="required"
                        {...formItemLayout}
                        label="代码"
                    >
                        <Input value={code} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'code')}/>
                    </FormItem>
                    <FormItem className="required"
                        {...formItemLayout}
                        label="日期"
                    >
                        <DatePicker value={date && moment(date)} style={{width:'165px'}} onChange={this.onDateFieldChange} placeholder="日期" />
                    </FormItem>
                    <FormItem className="required"
                        {...formItemLayout}
                        label="数量"
                    >
                        <Input value={count} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'count')}/>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="操作"
                    >
                        <Select style={{width:'165px'}} value={oper}  onChange={this.onSelectChange.bind(this,'oper')}>
                            {
                                Dict.recordOper.map(e=>{
                                    return <Select.Option value={e.value}>{e.label}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem className="required"
                        {...formItemLayout}
                        label="方向"
                    >
                        <Select style={{width:'165px'}} value={direction}  onChange={this.onSelectChange.bind(this,'direction')}>
                            {
                                Dict.recordDirection.map(e=>{
                                    return <Select.Option value={e.value}>{e.label}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem className="required"
                        {...formItemLayout}
                        label="价格"
                    >
                        <Input value={price} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'price')}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="止损价格"
                    >
                        <Input value={stopPrice} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'stopPrice')}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手续费"
                    >
                        <Input value={fee} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'fee')}/>
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

