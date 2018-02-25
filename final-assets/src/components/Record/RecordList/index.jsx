import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Input, Select, Collapse, Icon, DatePicker, Tabs, Table, Pagination, Radio, Modal } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import RecordGroupEdit from "components/Record/RecordGroupEdit/index.jsx";
import RecordEdit from "components/Record/RecordEdit/index.jsx";
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
        
       this.fetchGroupList()

       this.on('final:record-group-edit-finish',()=>{
           this.fetchGroupList();
       })

       this.on('final:record-edit-finish',()=>{
            this.fetchGroupList();
        })

        setInterval(()=>{
            this.setState({
                groupList:this.state.groupList
            })
        },Config.quote.intervalTime)
    }

    fetchGroupList = () => {
        let {tab} = this.state;
        let url = tab == 'all' ?'/recordGroup/getList':'/recordGroup/getPositionList'
        const self = this;
        request(url,
            (res) => {
               self.setState({
                    groupList:res.list
               })
               let codeArray = self.getCodeArray(res.list);
               Data.addCodeArrayToQuote(codeArray);
            }, {
            }, 'jsonp')
    }

    getCodeArray=(list)=>{
        let codeArray = [];
        for(let d of list){
            codeArray.push(d.code);
        }
        return codeArray;
    }


    onRecordGroupAddClick = () => {
        this.emit('final:record-group-edit-show');
    }

    onRecordAddClick = (group)=>{
        this.emit('final:record-edit-show',{groupId:group.id,code:group.code});
    }

    onShowRecordList = (i)=>{
        let {groupList} = this.state;
        groupList[i].visible = !groupList[i].visible;
        this.setState({groupList})
    }

    onRecordEditClick=(id)=>{
        this.emit('final:record-edit-show',{id:id})
    }

    onRecordDeleteClick=(id)=>{
        const self = this;
        Modal.confirm({
            title: '确定不是手抖点的删除?',
            content: '',
            onOk() {
                request('/record/deleteById',
                    (res) => {
                        self.fetchGroupList()
                    }, {
                        id: id
                    }, 'jsonp')
            },
            onCancel() {},
          })
    }

    onGroupDeleteClick=(id)=>{
        const self = this;
        Modal.confirm({
            title: '确定不是手抖点的删除?',
            content: '',
            onOk() {
                request('/recordGroup/deleteById',
                    (res) => {
                        self.fetchGroupList()
                    }, {
                        id: id
                    }, 'jsonp')
            },
            onCancel() {},
          })
    }
   
    render() {
        let {groupList} = this.state;
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
                        groupList.map((g,i)=>{
                            return (<div className="record-group">
                                    <div className="group-item mt10">
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
                                            <span className="ml10">
                                                <Icon className="c-p" type="down" onClick={this.onShowRecordList.bind(this,i)} />{g.recordList && g.recordList.length>0?<span>({g.recordList.length})</span>:''}
                                            </span>
                                            <span className="ml10">
                                                <Icon className="c-p" type="delete" onClick={this.onGroupDeleteClick.bind(this,g.id)} />
                                            </span>
                                        </div>
                                    </div>
                                    {
                                        g.visible == true && g.recordList && g.recordList.map(d=>{
                                            let quote = Data.quote[Util.getFullCode(d.code)];
                                            console.log('quote',quote)
                                            return (
                                                <div className="record-item">
                                                    <div className="list-col name">{Util.getStockName(d.code)}</div>
                                                    <div className="list-col code">{d.code}</div>
                                                    <div className="list-col number">{d.count}</div>
                                                    <div className="list-col cost">{d.price}</div>
                                                    <div className="list-col returns"></div>
                                                    <div className="list-col current">{quote && quote.current}</div>
                                                    <div className="list-col rise"></div>
                                                    <div className="list-col value"></div>
                                                    <div className="list-col proportion"></div>
                                                    <div className="list-col oper">
                                                        <span><Icon className="c-p" type="edit" onClick={this.onRecordEditClick.bind(this,d.id)} /></span>
                                                        <span className="ml20">
                                                            <Icon className="c-p" type="delete" onClick={this.onRecordDeleteClick.bind(this,d.id)} />
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>)
                                
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