import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Input, Select, Collapse, Icon, DatePicker, Tabs, Table, Pagination, Radio, Modal,Tag } from 'antd';
import FEvents from "components/Common/FEvent/index.js";

import { request } from "common/ajax.js";
import { URL, Util, Dict, Config,Data } from "common/config.js";
import './index.scss';




@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupList:[],
            tab:'position'
        };
    }

    componentDidMount() {
      
     
    }

    render() {
        return (
            <div className="record-list-container">
                <div className="mt30 mb30 ml20 record-list">
                    待开发
                </div>
                <div>
                    <RecordGroupEdit />
                    <RecordEdit />
                </div>
            </div>
        );
    }
}