import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { message,Input,Modal,Form,Select,Button,DatePicker,Tabs,Icon} from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import { request } from "common/ajax.js";
import { URL, Util,Dict } from "common/config.js";
const FormItem = Form.Item;


@FEvents
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type:'fetch', //fetch convert
            year:'2017',
            quarter:'4',
            reportType:'forecast', //report forecast
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

    
    onProcessReportClick=()=>{
        const {type}= this.state;
        if(type=='fetch'){
            this.fetchReport()
        }
        if(type=='convert'){
            this.convertReport()
        }
    }
   
    onProcessBasicsClick=()=>{
        const {type}= this.state;
        if(type=='fetch'){
            this.fetchBasic()
        }
        if(type=='convert'){
            this.convertBasic()
        }
    }

    fetchReport=()=>{
        const self = this;
        let hide = message.loading('start fetch '+this.state.reportType +' '+this.state.year+ ' ' +this.state.quarter,0)
        request('/python/fetch/report',(res)=>{
            console.log('fetch report finish',res);
            hide();
            if(res.isSuccess == true){
                self.setState({
                    type:'convert'
                },self.convertReport)
                
            }
		},{
            ...this.state
        },'json')
    }

    convertReport=()=>{
        const self = this;
        let hide = message.loading('start convert '+this.state.reportType +' '+this.state.year+ ' ' +this.state.quarter,0)

        request('/convert/report',(res)=>{
            console.log('convert report finish',res);
            hide();
		},{
            ...this.state
        },'jsonp')
    }

    fetchBasic=()=>{
        const self = this;
        request('/python/fetch/basic',(res)=>{
            console.log('fetch basic finish',res);
		},{
        },'json')
    }

    convertBasic=()=>{
        const self = this;
        request('/convert/basic',(res)=>{
            console.log('convert basic finish',res);
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
                        <Select.Option value="fetch">抓取</Select.Option>
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
                        <Button type="primary" shape="circle" size="small" onClick={this.onProcessReportClick} >go</Button>
                    </span>
                </div>
                <div className="mt10">
                    
                    <span>
                        基础信息 
                    </span>
                    <span className="ml10">
                        <Button type="primary" shape="circle" size="small" onClick={this.onProcessBasicsClick}  >go</Button>
                    </span>
                </div>
                </Modal>
            </div>
        );
    }
}

