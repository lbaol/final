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
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id:'',
            code:'',
            cost:'',
            date:'',
            number:'',
            visible: false
        };
    }

    componentDidMount() {
        this.on('final:pos-edit-show', (data) => {
            this.setState({
                id:data && data.id?data.id:'',
                data:'',
                number:'',
                code:'',
                cost:'',
                visible: true
            },this.fetchData);
        });
    }

    fetchData=()=>{
        let {id} = this.state;
        if(id){
            request('/pos/getById',
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

    onSaveClick=()=>{
        const self = this;
        request('/pos/save',
		(res)=>{
            self.setState({visible:false})
            self.emit('final:pos-edit-finish')
		},{
            ...this.state
        },'jsonp')
    }

    render() {
        const {number,date,id,code,cost} = this.state;
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
                    title={id?'修改持仓':'新增持仓'}
                    visible={this.state.visible}
                    onOk={this.onSaveClick}
                    onCancel={this.handleCancel}
                >
                    <FormItem
                        {...formItemLayout}
                        label="代码"
                    >
                        <Input value={code} style={{width:'165px'}} onChange={this.onInputChange.bind(this,'code')}/>
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
                        label="日期"
                    >
                        <DatePicker value={date} onChange={this.onDateFieldChange} placeholder="信号日期" />
                    </FormItem>
                </Modal>
            </div>
        );
    }
}

