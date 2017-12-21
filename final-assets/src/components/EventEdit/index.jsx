import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Modal,Form } from 'antd';
import FEvents from "../FEvent/index.js";

import { request } from "../../common/ajax.js";
import { URL, Util } from "../../common/config.js";

const FormItem = Form.Item;


@FEvents
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            code:'',
            visible: false,
            eventDate:'',
            type:'fault'
        };
    }

    componentDidMount() {
        const {code,eventDate} = this.state;
        this.on('final:event-edit-show', (data) => {
            this.setState({
                code:data && data.code?data.code:code,
                eventDate:data && data.eventDate?data.eventDate:eventDate,
                visible: true
            });
            
        });
    }
    
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onTypeChange=(value)=>{
        this.setState({
            type:value
        })
    }

    onDateFieldChange=(value, valueString)=>{
        this.setState({
            eventDate:valueString
        })
    }

    onSaveClick=()=>{
        const self = this;
        request('/event/save',
		(res)=>{
            self.setState({visible:false})
            self.emit('final:event-edit-finish')
		},{
            ...this.state
        },'jsonp')
    }

    render() {
        const {type,eventDate} = this.state;
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
                    title="增加信号"
                    visible={this.state.visible}
                    onOk={this.onSaveClick}
                    onCancel={this.handleCancel}
                >
                    <FormItem
                        {...formItemLayout}
                        label="日期"
                    >
                        <DatePicker defaultValue={eventDate && moment(eventDate, 'YYYY-MM-DD')} onChange={this.onDateFieldChange} placeholder="信号日期" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="类型"
                    >
                        <Select defaultValue={type}  onChange={this.onTypeChange}>
                            <Select.Option value="fault">断层</Select.Option>
                            <Select.Option value="handle">杯柄</Select.Option>
                        </Select>
                    </FormItem>
                </Modal>
            </div>
        );
    }
}

