import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import {  Input,Modal,Form,Select,DatePicker} from 'antd';
import FEvents from "../../FEvent/index.js";
import { request } from "../../../common/ajax.js";
import { URL, Util,Dict } from "../../../common/config.js";
const FormItem = Form.Item;


@FEvents
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            code:'',
            visible: false,
            content:'',
            type:'summary',
            date:''
        };
    }

    componentDidMount() {
        const {code,type} = this.state;
        this.on('final:note-default-edit-show', (data) => {
            this.setState({
                code:data && data.code,
                type:'summary'
            },this.fatchDefaultByCode);
        });

        this.on('final:note-overall-edit-show', (data) => {
            this.setState({
                type:'overall'
            },this.fatchOverall);
        });
    }


    fatchOverall=()=>{
        const self = this;
        request('/note/getOverall',
		(res)=>{
            
            self.setState({
                content:res && res.content,
                visible:true
            })
            
		},{
        },'jsonp')
    }

    fatchDefaultByCode=()=>{
        const {code} = this.state;
        const self = this;
        request('/note/getByParam',
		(res)=>{
            
            if(res.noteList && res.noteList.length > 0){
                self.setState({
                    content:res.noteList[0].content,
                    visible:true
                })
            }else{
                self.setState({
                    content:'',
                    visible:true
                })
            }
            
		},{
            code:code,
            type:'default'
        },'jsonp')
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

    onTypeChange=(value)=>{
        this.setState({
            type:value
        })
    }

    onDateChange=(date, dateString) =>{
        this.setState({
            date:dateString
        })
    }

   

    onSaveClick=()=>{
        const self = this;
        const {code,content,type,date} = this.state;
        request('/note/addOrUpdateContent',
		(res)=>{
            self.setState({visible:false})
		},{
            code:code,
            content:content,
            type:type,
            date:date
        },'jsonp')
    }

    render() {
        const {content,code,type,date} = this.state;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 18 },
            },
          };
        return (
            <div>
                <Modal
                    width={1000}
                    title="笔记"
                    visible={this.state.visible}
                    onOk={this.onSaveClick}
                    onCancel={this.handleCancel}
                >
                    <Form >
                        {
                            type!='overall' && 
                            <FormItem label="代码"  {...formItemLayout}>
                                {code}
                            </FormItem>
                        }
                        
                        <FormItem label="类型"  {...formItemLayout}>
                            <Select style={{width:'150px'}} value={type} disabled={type=='overall'?true:false}  onChange={this.onTypeChange}>
                                {
                                    Dict.noteType.map(e=>{
                                        return <Select.Option value={e.value}>{e.label}</Select.Option>
                                    })
                                }
                            </Select>
                            {
                                type == 'date' && 
                                <span className="ml10">
                                    <DatePicker value={date ? moment(date):moment()} onChange={this.onDateChange} />
                                </span>
                            }
                            
                        </FormItem>
                        <FormItem label="内容"  {...formItemLayout}>
                            <Input.TextArea rows={20} value={content} onChange={this.onInputChange.bind(this,'content')}/>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

