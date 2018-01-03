import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Icon,Select, Input, DatePicker } from 'antd';
import FEvents from "components/Common/FEvent/index.js";

import { request } from "common/ajax.js";
import { URL, Util,Dict } from "common/config.js";



@FEvents
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventDate:'',
            type:'fault'
        };
    }

    componentDidMount() {
        
        
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
            self.emit('final:event-list-refresh')
		},{
            code:this.props.code,
            ...this.state
        },'jsonp')
    }

    render() {
        const {type,eventDate} = this.state;
        
        return (
            <div>
                <DatePicker  style={{width:'110px'}} size="small" value={eventDate ? moment(eventDate, 'YYYY-MM-DD'):moment()} onChange={this.onDateFieldChange} placeholder="信号日期" />
                <Select  style={{width:'70px'}} size="small" value={type}  onChange={this.onTypeChange}>
                    {
                        Dict.eventType.map(e=>{
                            return <Select.Option value={e.value}>{e.label}</Select.Option>
                        })
                    }
                </Select>
                <Icon type="plus" onClick={this.onSaveClick} />
            </div>
        );
    }
}

