import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import {  Input,Modal,Form,Select,Button,DatePicker,Tabs,Icon} from 'antd';
import FEvents from "../../FEvent/index.js";
import { request } from "../../../common/ajax.js";
import { URL, Util,Dict,Domain } from "../../../common/config.js";
const FormItem = Form.Item;


@FEvents
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type:'convert',
            year:'2017',
            quarter:'1',
            reportType:'report',
        };
    }

    componentDidMount() {
        const {code,type} = this.state;
        this.on('final:data-setting-show', () => {
            this.setState({
                visible:true
            })
            
        });
    }

  
    
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }


    onSelectChange=(name,value)=>{
        this.setState({
            [name]:value
        })
    }

    
    onFatchReportClick=()=>{

    }
   
    onFatchBasicsClick=()=>{
        const self = this;
        request('http://127.0.0.1:8001/helloworld/qqq',
		(res)=>{
            
            console.log(res)
            
		},{
        },'json')
    }

   

    render() {
        const {year,quarter,reportType,type} = this.state;
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
                    title="数据设置"
                    visible={this.state.visible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                <div className="mt10">
                    
                    <Select style={{width:'120px'}} value={type}  onChange={this.onSelectChange.bind(this,'type')}>
                        <Select.Option value="fatch">抓取</Select.Option>
                        <Select.Option value="convert">转换</Select.Option>
                    </Select>
                </div>

                <div className="mt10">
                    <span >
                        <Select style={{width:'120px'}} value={year}  onChange={this.onSelectChange.bind(this,'year')}>
                            {
                                Dict.yearType.map((d)=>{
                                    return <Select.Option value={d.value}>{d.label}</Select.Option>
                                })
                            }
                        </Select>
                    </span>
                    <span className="ml10">
                        <Select  style={{width:'80px'}} value={quarter}  onChange={this.onSelectChange.bind(this,'quarter')}>
                            {
                                Dict.quarterType.map((d)=>{
                                    return <Select.Option value={d.value}>{d.label}</Select.Option>
                                })
                            }
                        </Select>
                    </span>
                    <span className="ml10">
                        <Select  style={{width:'120px'}} value={reportType}  onChange={this.onSelectChange.bind(this,'reportType')}>
                            {
                                Dict.reportType.map((d)=>{
                                    return <Select.Option value={d.value}>{d.label}</Select.Option>
                                })
                            }
                        </Select>
                    </span>
                    <span className="ml10">
                        <Button type="primary" shape="circle" size="small" onClick={this.onFatchReportClick} >go</Button>
                    </span>
                </div>
                <div className="mt10">
                    
                    <span>
                        基础信息 
                    </span>
                    <span className="ml10">
                        <Button type="primary" shape="circle" size="small" onClick={this.onFatchBasicsClick}  >go</Button>
                    </span>
                </div>
                </Modal>
            </div>
        );
    }
}

