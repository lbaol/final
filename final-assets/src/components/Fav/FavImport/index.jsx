import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import {  Select,Modal,Input } from 'antd';
import FEvents from "../../FEvent/index.js";
import { request } from "../../../common/ajax.js";
import { URL, Util,Dict } from "../../../common/config.js";



@FEvents
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            typeValue:[],
            typeDS:Dict.favTypeDict,
            codes:''
        };
    }

    componentDidMount() {
        const {code,type} = this.state;
        this.on('final:fav-import-show', (data) => {
            this.setState({
                visible:true
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
            typeValue:value
        })
    }

    onCodesChange=(e)=>{
        let value = e.target.value;        
        this.setState({
            codes:value
        })
    }

   

    onSaveClick=()=>{
        const self = this;
        const {codes} = this.state;
        let newCodes = codes.replace(/[\r\n]/g, ',');
        console.log(value)
        request('/fav/import',
		(res)=>{
            self.setState({visible:false})
            self.emit('final:fav-import-finish')
		},{
            codes:newCodes
        },'jsonp')
    }

    render() {
        const {typeDS,typeValue} = this.state;
        return (
            <div>
                <Modal
                    title="批量导入"
                    visible={this.state.visible}
                    onOk={this.onSaveClick}
                    onCancel={this.handleCancel}
                >
                    <Select style={{width:'200px'}} onChange={this.onTypeChange}>
                        {
                            typeDS.map((t)=>{
                                return <Select.Option value={t.value}>{t.label}</Select.Option>
                            })
                        }
                        
                    </Select>
                    <div className="mt10">
                        <Input.TextArea onChange={this.onCodesChange} rows={10} />
                    </div>
                    
                </Modal>
            </div>
        );
    }
}

