import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import {  Input,Modal,Form} from 'antd';
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
            content:''
        };
    }

    componentDidMount() {
        const {code,type} = this.state;
        this.on('final:note-default-edit-show', (data) => {
            this.setState({
                code:data && data.code
            },this.fatchDefaultByCode);
            
        });
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

   

    onSaveClick=()=>{
        const self = this;
        const {code,content} = this.state;
        request('/note/updateDefaultContent',
		(res)=>{
            self.setState({visible:false})
            self.emit('final:fav-edit-finish')
		},{
            code:code,
            content:content
        },'jsonp')
    }

    render() {
        const {content,code} = this.state;
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
                        <FormItem label="代码"  {...formItemLayout}>
                            {code}
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

