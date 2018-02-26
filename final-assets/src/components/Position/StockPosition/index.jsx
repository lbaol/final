import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Input, Select, Collapse, Icon, DatePicker, Tabs, Table, Pagination, Radio, Modal,Tag } from 'antd';
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
            groupList:[]

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
            this.intervalRefresh();
        },2000)
    }

    intervalRefresh=()=>{
        let {groupList} = this.state;

        for(let g of groupList){
            let quote = Data.quote[Util.getFullCode(g.code)]
            if(quote){
                let groupWarn = false;
                for(let d of g.recordList){
                    //处理止损价格
                    if(quote.current<=d.stopPrice){
                        console.log(d.code,'到达止损价格:',d.stopPrice)
                        d.warn = true;
                        groupWarn = true;
                    }else{
                        d.warn = false;
                    } 

                    d.value = _.round(d.count * quote.current,2);
                }
                g.warn = groupWarn;
                //处理市值
                g.value = _.round(g.count * quote.current,2);
            }
        }
        groupList = _.orderBy(groupList, 'value','desc');
        this.setState({groupList})
    }

    fetchGroupList = () => {
        let {tab} = this.state;
        const self = this;
        request('/recordGroup/getPositionByMarketAndType',
            (res) => {
                let groupList = res.list;
                this.preProcess(groupList);
               self.setState({
                    groupList:groupList
               })
               let codeArray = self.getCodeArray(groupList);
               Data.addCodeArrayToQuote(codeArray);
            }, {
                market:this.props.market,
                type:this.props.type
            }, 'jsonp')
    }

    preProcess=(groupList)=>{
        //设置止损价
        for(let g of groupList){
            for(let r of g.recordList){
                if(!r.stopPrice){
                    r.stopPrice = _.round(r.price*(1-0.08),2);
                }
            }
        }
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

    onRecordGroupEditClick=(id)=>{
        this.emit('final:record-group-edit-show',{id:id})
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

    sumTotalValue = () => {
        let {groupList} = this.state;
        let totalValue = 0;
        for (let d of groupList) {
            if (Data.quote[Util.getFullCode(d.code)]) {
                let current = Data.quote[Util.getFullCode(d.code)].current;
                if (_.isNumber(_.toNumber(current))) {
                    totalValue = totalValue + _.round(d.count * current)
                }
            }
        }
        return totalValue;
    }

   

    renderProportionCell=(count,quote,totalValue)=>{
        if(!count || !quote){
            return;
        }
        return <span>{_.round(count * quote.current/totalValue*100)}%</span>
    }

    renderReturnsCell=(price,quote)=>{
        if(!price || !quote){
            return;
        }
        return Util.renderRisePercent(_.round((quote.current-price)/price*100,2))
    }
   
    render() {
        let {groupList} = this.state;
        let totalValue = this.sumTotalValue();
        return (
            <div className="record-list-container">
                <div className="mt30 mb30 ml20 record-list">
                    <div>
                        <span>A股持仓及操作记录</span> 
                        <span className="ml30">市值：{totalValue}</span>  
                        <span className="ml30" placehold="增加操作记录分组" >
                            <Icon className="c-p" type="plus-circle-o" onClick={this.onRecordGroupAddClick} />
                        </span>     
                    </div>
                    <div className="mt10">
                        <div className="list-col name">名称</div>
                        <div className="list-col code">代码</div>
                        <div className="list-col date">日期</div>
                        <div className="list-col number">数量</div>
                        <div className="list-col price">成本</div>
                        <div className="list-col returns">收益</div>
                        <div className="list-col stop-price">止损</div>
                        <div className="list-col current">当前价格</div>
                        <div className="list-col rise">当日涨幅</div>
                        <div className="list-col value">市值</div>
                        <div className="list-col proportion">占比</div>
                        <div className="list-col oper">操作</div>
                    </div>
                    {
                        groupList.map((g,i)=>{
                            let quote = Data.quote[Util.getFullCode(g.code)];
                            return (<div className="record-group">
                                    <div className="group-item">
                                        <div className="list-col name">{Util.getStockName(g.code)}</div>
                                        <div className="list-col code">{g.code}</div>
                                        <div className="list-col date">{g.startDate}</div>
                                        <div className="list-col number">{g.count}</div>
                                        <div className="list-col price">{g.price}</div>
                                        <div className="list-col returns">{this.renderReturnsCell(g.price,quote)}</div>
                                        <div className="list-col stop-price">{g.warn==true && <span className="warn-tag"></span>}</div>
                                        <div className="list-col current">{quote && quote.current}</div>
                                        <div className="list-col rise">{quote && Util.renderRisePercent(quote.percentage)}</div>
                                        <div className="list-col value">{g.value}</div>
                                        <div className="list-col proportion">{this.renderProportionCell(g.count,quote,totalValue)}</div>
                                        <div className="list-col oper">
                                            <Icon className="c-p" type="plus-circle-o" onClick={this.onRecordAddClick.bind(this,g)} />
                                            <span className="ml10">
                                                <Icon className="c-p" type="edit" onClick={this.onRecordGroupEditClick.bind(this,g.id)} />
                                            </span>
                                            <span className="ml10">
                                                <Icon className="c-p" type="delete" onClick={this.onGroupDeleteClick.bind(this,g.id)} />
                                            </span>
                                            <span className="ml10">
                                                {g.recordList && g.recordList.length>0 && 
                                                    <span><Icon className="c-p" type="down" onClick={this.onShowRecordList.bind(this,i)} />({g.recordList.length})</span>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    {
                                        g.visible == true && g.recordList && g.recordList.map(d=>{
                                            
                                            return (
                                                <div className="record-item">
                                                    <div className="list-col name">{Util.getStockName(d.code)}</div>
                                                    <div className="list-col code">{d.code}</div>
                                                    <div className="list-col date">{d.date}</div>
                                                    <div className="list-col number">{d.count}</div>
                                                    <div className="list-col price">{d.price}</div>
                                                    <div className="list-col returns">{this.renderReturnsCell(d.price,quote)}</div>
                                                    <div className="list-col stop-price"><span className={d.warn==true?'warn':''}>{d.stopPrice}</span></div>
                                                    <div className="list-col current">{quote && quote.current}</div>
                                                    <div className="list-col rise">{quote && Util.renderRisePercent(quote.percentage)}</div>
                                                    <div className="list-col value">{d.value}</div>
                                                    <div className="list-col proportion">{this.renderProportionCell(d.count,quote,totalValue)}</div>
                                                    <div className="list-col oper">
                                                        <span><Icon className="c-p" type="edit" onClick={this.onRecordEditClick.bind(this,d.id)} /></span>
                                                        <span className="ml10">
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