import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Input, Select, Collapse, Icon, DatePicker, Tabs, Table, Pagination, Radio, Modal } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import RecordGroupEdit from "components/Record/RecordGroupEdit/index.jsx";
import RecordEdit from "components/Record/RecordEdit/index.jsx";
import { request } from "common/ajax.js";
import { URL, Util, Dict, Config } from "common/config.js";
import './index.scss';




@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordGroupList:[],
            tab:'position'
        };
    }

    componentDidMount() {
        
       this.fetchRecordGroupList()

       this.on('final:record-group-edit-finish',()=>{
           this.fetchRecordGroupList();
       })
    }

    fetchRecordGroupList = () => {
        let {tab} = this.state;
        let url = tab == 'all' ?'/recordGroup/getList':'/recordGroup/getPositionList'
        const self = this;
        request(url,
            (res) => {
               self.setState({
                    recordGroupList:res.list
               })
            }, {
            }, 'jsonp')
    }


    onRecordGroupAddClick = () => {
        this.emit('final:record-group-edit-show');
    }

    onRecordAddClick = (group)=>{
        this.emit('final:record-edit-show',{groupId:group.id,code:group.code});
    }

   
    render() {
        let {recordGroupList} = this.state;
        return (
            <div className="record-list-container">
                <div className="pt10 pb10 pl10">
                    <span >
                        <Icon className="c-p" type="plus-circle-o" onClick={this.onRecordGroupAddClick} />
                    </span>
                    
                </div>
                <div className="mt30 mb30 ml20 record-list">
                    <div className="mt10">
                        <div className="list-col name">名称</div>
                        <div className="list-col code">代码</div>
                        <div className="list-col number">数量</div>
                        <div className="list-col cost">成本</div>
                        <div className="list-col returns">收益</div>
                        <div className="list-col current">当前价格</div>
                        <div className="list-col rise">当日涨幅</div>
                        <div className="list-col value">市值</div>
                        <div className="list-col proportion">占比</div>
                        <div className="list-col oper">操作</div>
                    </div>
                    {
                        recordGroupList.map(g=>{
                            return <div className="group-item mt10">
                                <div className="list-col name">{Util.getStockName(g.code)}</div>
                                <div className="list-col code">{g.code}</div>
                                <div className="list-col number">{g.count}</div>
                                <div className="list-col cost">{g.cost}</div>
                                <div className="list-col returns"></div>
                                <div className="list-col current"></div>
                                <div className="list-col rise"></div>
                                <div className="list-col value"></div>
                                <div className="list-col proportion"></div>
                                <div className="list-col oper">
                                    <Icon className="c-p" type="plus-circle-o" onClick={this.onRecordAddClick.bind(this,g)} />
                                </div>
                            </div>
                            })
                    }
                </div>
                <div>
                    <RecordGroupEdit />
                    <RecordEdit />
                </div>
            </div>
        );
    }
}