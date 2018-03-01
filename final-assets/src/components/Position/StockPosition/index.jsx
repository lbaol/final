import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Input, Select, Collapse, Icon, DatePicker, Tabs, Table, Pagination, Radio, Modal, Tag } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import RecordGroupEdit from "components/Record/RecordGroupEdit/index.jsx";
import RecordEdit from "components/Record/RecordEdit/index.jsx";
import { request } from "common/ajax.js";
import { URL, Util, Dict, Config, Data } from "common/config.js";
import './index.scss';




@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupList: [],
            type:props.type, //stock股票 futures期货
            stockTotalValue:0,
            futuresTotalReturns:0,
            isGroupItemVisable:false
        };
    }

    componentDidMount() {

        this.fetchGroupList()

        this.on('final:record-group-edit-finish', () => {
            this.fetchGroupList();
        })

        this.on('final:record-edit-finish', () => {
            this.fetchGroupList();
        })

        setInterval(() => {
            this.intervalRefresh();
        }, 2000)
    }

    intervalRefresh = () => {
        let {type} = this.state;
        type == 'stock' && this.stockIntervalRefresh();
        type == 'futures' && this.futuresIntervalRefresh();
    }

    fetchGroupList = () => {
        let { type } = this.state;
        const self = this;
        request('/recordGroup/getPositionByMarketAndType',
            (res) => {
                let groupList = res.list;
                
                let codeArray = self.getCodeArray(groupList);
                if(type=='stock'){
                    this.stockPreProcess(groupList);
                    Data.addCodesToStockQuote(codeArray);
                }
                if(type=='futures'){
                    Data.addCodesToFuturesQuote(codeArray);
                }
                self.setState({
                    groupList: groupList
                })

                
                

            }, {
                market: this.props.market,
                type: this.props.type
            }, 'jsonp')
    }

    



    getCodeArray = (list) => {
        let codeArray = [];
        for (let d of list) {
            codeArray.push(d.code);
        }
        return codeArray;
    }


    onRecordGroupAddClick = () => {
        this.emit('final:record-group-edit-show');
    }

    onRecordAddClick = (group) => {
        this.emit('final:record-edit-show', { groupId: group.id, code: group.code, market: group.market, type: group.type });
    }

    onShowRecordList = (i) => {
        let { groupList } = this.state;
        groupList[i].visible = !groupList[i].visible;
        this.setState({ groupList })
    }

    onRecordEditClick = (id) => {
        this.emit('final:record-edit-show', { id: id })
    }

    onRecordGroupEditClick = (id) => {
        this.emit('final:record-group-edit-show', { id: id })
    }

    onRecordDeleteClick = (id) => {
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
            onCancel() { },
        })
    }

    onGroupDeleteClick = (id) => {
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
            onCancel() { },
        })
    }

    
    renderGroupOper=(g,i)=>{
        return <span>
            <span>
                <Icon className="c-p" type="plus-circle-o" onClick={this.onRecordAddClick.bind(this, g)} />
            </span>
            <span className="ml10">
                <Icon className="c-p" type="edit" onClick={this.onRecordGroupEditClick.bind(this, g.id)} />
            </span>
            <span className="ml10">
                <Icon className="c-p" type="delete" onClick={this.onGroupDeleteClick.bind(this, g.id)} />
            </span>
            <span className="ml10">
                {g.recordList && g.recordList.length > 0 &&
                    <span><Icon className="c-p" type="down" onClick={this.onShowRecordList.bind(this, i)} />({g.recordList.length})</span>
                }
            </span>
        </span>
    }

    renderRecordOper=(d)=>{
        return <span>
            <span>
                <Icon className="c-p" type="edit" onClick={this.onRecordEditClick.bind(this, d.id)} />
            </span>
            <span className="ml10">
                <Icon className="c-p" type="delete" onClick={this.onRecordDeleteClick.bind(this, d.id)} />
            </span>
        </span>
    }

    onGroupListCollapseClick = () => {
        let {groupList,isGroupItemVisable} = this.state;
        let visible = !isGroupItemVisable;
        for(let d of groupList){
            d.visible = visible;
        }
        this.setState({
            groupList:groupList,
            isGroupItemVisable:visible
        })
    }

    /* ================================ stock 相关处理 start ================================ */

    stockPreProcess = (groupList) => {
        //设置止损价
        for (let g of groupList) {
            for (let r of g.recordList) {
                if (!r.stopPrice) {
                    r.stopPrice = _.round(r.price * (1 - 0.08), 2);
                }
            }
        }
    }

    stockIntervalRefresh=()=>{
        let { groupList } = this.state;


        // for (let d of g.recordList) {
        //     //处理止损价格
        //     // if (quote.current <= d.stopPrice) {
        //     //     console.log(d.code, '到达止损价格:', d.stopPrice)
        //     //     d.warn = true;
        //     //     groupWarn = true;
        //     // } else {
        //     //     d.warn = false;
        //     // }

        //     d.value = _.round(d.count * quote.current, 2);
        //     //处理收益
        //     d.returns =_.round((quote.current - d.price) / d.price * 100, 2);
            
        // }
        // g.warn = groupWarn;
        // //处理市值
        // g.value = _.round(g.count * quote.current, 2);
        // totalValue = totalValue + g.value;
        // //处理收益
        // g.returns =_.round((quote.current - g.price) / g.price * 100, 2);
       
        let totalValue = 0;
        let totalReturns = 0;
        for (let g of groupList) {
            let quote = Data.getStockQuote(g.code);
            let groupWarn = false;
            g.remaining = 0 ; 
            g.count = 0 ;
            g.returns = 0;
            g.openRise = 0;
            if (quote) {
                for (let d of g.recordList) {
                    if(d.closeRecordList && d.closeRecordList.length > 0 ){
                        //如果还有剩余仓位，先计算剩余仓位的浮盈
                        if(d.remaining){
                            d.returns = _.round(d.remaining*(quote.current - d.price), 2);
                        }else{
                            d.returns = 0;
                        }
                        for(let c of d.closeRecordList){
                            //计算平仓时的收益
                            c.returns = _.round(c.count * (c.price-d.price),2);
                            d.returns = d.returns + c.returns;
                        }
                    }else{
                        //计算收益：如果没有平仓记录，用剩余仓位、当前行情、开仓价格计算收益
                        d.returns = _.round(d.remaining*(quote.current - d.price), 2);
                    }
                    if (quote.current <= d.stopPrice) {
                        console.log(d.code,quote.name, '到达止损价格:', d.stopPrice)
                        d.warn = true;
                        groupWarn = true;
                    }else{
                        d.warn = false;
                    }
                    d.value = _.round(d.remaining * quote.current, 2);
                    g.returns = g.returns + d.returns;
                    g.remaining = g.remaining + d.remaining;
                    g.count = g.count + d.count;
                    //开仓后的涨跌幅
                    d.openRise = _.round((quote.current - d.price)/d.price*100,2);
                    g.openRise = g.openRise + (d.openRise * d.count) ;
                }
                totalReturns = totalReturns + g.returns;
                g.value = _.round(g.remaining * quote.current, 2);
                totalValue = totalValue + g.value;
                g.openRise = _.round(g.openRise/g.count, 2);
                g.warn = groupWarn;
            }
        }

        

        groupList = _.orderBy(groupList, 'value', 'desc');
        this.setState({ 
            groupList,
            stockTotalValue:totalValue
         })
    }

  
    stockRenderProportionCell = (value, totalValue) => {
        if (!value || !totalValue) {
            return;
        }
        return <span>{_.round(value / totalValue * 100)}%</span>
    }

    stockRenderBlock=()=>{
        let { groupList,type,stockTotalValue } = this.state;
        
        return (
            <div className="mt30 mb30 ml20 record-list">
                <div>
                    <span>{Dict.marketTypeMapper[this.props.market] + '持仓及交易记录'}</span>
                    <span className="ml30">市值：{stockTotalValue}</span>
                    <span className="ml30" placehold="增加操作记录分组" >
                        <Icon className="c-p" type="plus-circle-o" onClick={this.onRecordGroupAddClick} />
                    </span>
                    <span className="ml20">
                        <Icon className="c-p"  type="profile" onClick={this.onGroupListCollapseClick} />
                    </span>
                </div>
                <div className="mt10 stock-list-w">
                    <div className="list-col name">名称</div>
                    <div className="list-col code">代码</div>
                    <div className="list-col date">日期</div>
                    <div className="list-col oper">买卖</div>
                    <div className="list-col count">开仓数量</div>
                    <div className="list-col remaining">剩余数量</div>
                    <div className="list-col price">买价/卖价</div>
                    <div className="list-col open-rise">开仓涨跌</div>
                    <div className="list-col stop-price">止损</div>
                    <div className="list-col current">当前价格</div>
                    <div className="list-col today-rise">当日涨幅</div>
                    <div className="list-col value">市值</div>
                    <div className="list-col proportion">占比</div>
                    <div className="list-col row-oper">操作</div>
                </div>
                {
                    groupList.map((g, i) => {
                        let quote = Data.getStockQuote(g.code);
                        return (<div className="record-group ">
                            <div className="group-item stock-list-w">
                                <div className="list-col name">{quote && quote.name}</div>
                                <div className="list-col code">{g.code}</div>
                                <div className="list-col date">{g.startDate}</div>
                                <div className="list-col oper"></div>
                                <div className="list-col count">{g.count}</div>
                                <div className="list-col remaining">{g.remaining}</div>
                                <div className="list-col price">{g.price}</div>
                                <div className="list-col open-rise">{Util.renderRisePercent(g.openRise)}</div>
                                <div className="list-col stop-price">{g.warn == true && <span className="warn-tag"></span>}</div>
                                <div className="list-col current">{quote && quote.current}</div>
                                <div className="list-col today-rise">{quote && Util.renderRisePercent(quote.percentage)}</div>
                                <div className="list-col value">{g.value}</div>
                                <div className="list-col proportion">{this.stockRenderProportionCell(g.value, stockTotalValue)}</div>
                                <div className="list-col row-oper">
                                    {this.renderGroupOper(g,i)}
                                </div>
                            </div>
                            {
                                
                                g.visible == true && g.recordList && g.recordList.map(d => {
                                    return this.stockRenderRecordBlock(d,g,quote,true)
                                })
                            }
                        </div>)

                    })
                }
            </div>)
    }

    stockRenderRecordBlock=(d,g,quote,isOpen)=>{
        let {stockTotalValue } = this.state;
        return (
            <div className={isOpen==true?"record-items stock-list-w":''}>
                <div className="record-item">
                    <div className="list-col name">{quote && quote.name}</div>
                    <div className="list-col code">{d.code}</div>
                    <div className="list-col date">{d.date}</div>
                    <div className={"list-col oper "+(isOpen==true?'c-pri':'')}>{Dict.recordOperMapper[d.oper]}</div>
                    <div className="list-col count">{d.count}</div>
                    <div className="list-col remaining">{d.remaining}</div>
                    <div className="list-col price">{d.price}</div>
                    <div className="list-col open-rise">{Util.renderRisePercent(d.openRise)}</div>
                    <div className="list-col stop-price"><span className={d.warn == true ? 'warn' : ''}>{d.stopPrice}</span></div>
                    <div className="list-col current">{quote && quote.current}</div>
                    <div className="list-col today-rise">{quote && Util.renderRisePercent(quote.percentage)}</div>
                    <div className="list-col value">{d.value}</div>
                    <div className="list-col proportion">{this.stockRenderProportionCell(d.value, stockTotalValue)}</div>
                    <div className="list-col row-oper">
                        {this.renderRecordOper(d)}
                    </div>
                </div>
                {d.closeRecordList && d.closeRecordList.map(d2=>{
                    return this.stockRenderRecordBlock(d2,g,quote)
                })}
            </div>
        )
    }

    /* ================================ stock 相关处理 end ================================ */


    /* ================================ futures 相关处理 start ================================ */

    futuresIntervalRefresh=()=>{
        let { groupList } = this.state;
        let totalReturns = 0;
        for (let g of groupList) {
            g.returns = 0;
            g.count = 0;
            g.remaining = 0;
            let quote = Data.getFuturesQuote(g.code)
            if (quote) {
                let groupWarn = false;
                for (let d of g.recordList) {
                    if(d.closeRecordList && d.closeRecordList.length > 0 ){
                        //如果还有剩余仓位，先计算剩余仓位的浮盈
                        if(d.remaining){
                            d.returns = _.round(d.remaining*(quote.current - d.price)*300, 2);
                        }else{
                            d.returns = 0;
                        }
                        for(let c of d.closeRecordList){
                            //计算平仓时的收益
                            c.returns = _.round(c.count * (c.price-d.price)*300,2);
                            d.returns = d.returns + c.returns;
                        }
                    }else{
                        //计算收益：如果没有平仓记录，用剩余仓位、当前行情、开仓价格计算收益
                        d.returns = _.round(d.remaining*(quote.current - d.price)*300, 2);
                    }  
                    g.returns = g.returns + d.returns;
                    g.remaining = g.remaining + d.remaining;
                    g.count = g.count + d.count;
                    //开仓后的涨跌幅
                    d.openRise = _.round((quote.current - d.price)/d.price*100,2);
                }
                totalReturns = totalReturns + g.returns;
            }
        }
        
        this.setState({ 
            groupList:groupList,
            futuresTotalReturns:totalReturns
        })
    }

    futuresRenderBlock=()=>{
        let { groupList,type,futuresTotalReturns } = this.state;
        
        return (
            <div className="mt30 mb30 ml20 record-list">
                <div>
                    <span>期货持仓及交易记录</span>
                    <span className="ml30">总收益：{futuresTotalReturns}</span>
                    <span className="ml30" placehold="增加操作记录分组" >
                        <Icon className="c-p" type="plus-circle-o" onClick={this.onRecordGroupAddClick} />
                    </span>
                    <span className="ml20">
                        <Icon className="c-p"  type="profile" onClick={this.onGroupListCollapseClick} />
                    </span>
                </div>
                <div className="mt10  futures-list-w">
                    <div className="list-col id">ID</div>
                    <div className="list-col code">代码</div>
                    <div className="list-col direction">方向</div>
                    <div className="list-col date">日期</div>
                    <div className="list-col oper">买卖</div>
                    <div className="list-col sub-oper">开平</div>
                    <div className="list-col count">开仓数量</div>
                    <div className="list-col remaining">剩余数量</div>
                    <div className="list-col price">买价/卖价</div>
                    <div className="list-col returns">收益</div>
                    <div className="list-col open-rise">开仓涨跌</div>
                    <div className="list-col stop-price">止损</div>
                    <div className="list-col current">当前价格</div>
                    <div className="list-col today-rise">当日涨幅</div>
                    <div className="list-col value">市值</div>
                    <div className="list-col proportion">占比</div>
                    <div className="list-col row-oper">操作</div>
                </div>
                {
                    groupList.map((g, i) => {
                        let quote = Data.getFuturesQuote(g.code);
                        return (<div className="record-group  ">
                            <div className="group-item futures-list-w">
                                <div className="list-col id"></div>
                                <div className="list-col code">{g.code}</div>
                                <div className="list-col direction">
                                    {g.direction=='long' &&  <span className="c-red">{Dict.recordDirectionMapper[g.direction]}</span>}
                                    {g.direction=='short' &&  <span className="c-green">{Dict.recordDirectionMapper[g.direction]}</span>}
                                </div>
                                <div className="list-col date">{g.startDate}</div>
                                <div className="list-col oper"></div>
                                <div className="list-col sub-oper"></div>
                                <div className="list-col count">{g.count?g.count:''}</div>
                                <div className="list-col remaining">{g.remaining?g.remaining:''}</div>
                                <div className="list-col price">{g.price}</div>
                                <div className="list-col returns c-pri">{g.returns?g.returns:''}</div>
                                <div className="list-col open-rise"></div>
                                <div className="list-col stop-price">{g.warn == true && <span className="warn-tag"></span>}</div>
                                <div className="list-col current">{quote && quote.current}</div>
                                <div className="list-col today-rise">{quote && Util.renderRisePercent(quote.percentage)}</div>
                                <div className="list-col value"></div>
                                <div className="list-col proportion"></div>
                                <div className="list-col row-oper">
                                    {this.renderGroupOper(g,i)}
                                </div>
                            </div>
                            {
                                g.visible == true && g.recordList && g.recordList.map(d => {
                                    return this.futuresRenderRecordBlock(d,g,quote,true)
                                })
                            }
                        </div>)

                    })
                }
            </div>)
    }

    futuresRenderRecordBlock=(d,g,quote,isOpen)=>{
        return (
            <div className={isOpen==true?"record-items futures-list-w":''}>
                <div className="record-item">
                    <div className="list-col id">{d.id}</div>
                    <div className="list-col code">{d.code}</div>
                    <div className="list-col direction">
                        {g.direction=='long' &&  <span className="c-red">{Dict.recordDirectionMapper[g.direction]}</span>}
                        {g.direction=='short' &&  <span className="c-green">{Dict.recordDirectionMapper[g.direction]}</span>}
                    </div>
                    <div className="list-col date">{d.date}</div>
                    <div className={"list-col oper "+(isOpen==true?'c-pri':'')}>{Dict.recordOperMapper[d.oper]}</div>
                    <div className={"list-col sub-oper "+(isOpen==true?'c-pri':'')}>{Dict.recordSubOperMapper[d.subOper]}</div>
                    <div className="list-col count">{d.count}</div>
                    <div className="list-col remaining">{d.remaining}</div>
                    <div className="list-col price">{d.price}</div>
                    <div className={"list-col returns "+(isOpen==true?'c-pri':'')}>{d.returns}</div>
                    <div className="list-col open-rise">{d.openRise && <span>{d.openRise}%</span>}</div>
                    <div className="list-col stop-price"><span className={d.warn == true ? 'warn' : ''}>{d.stopPrice}</span></div>
                    <div className="list-col current">{quote && quote.current}</div>
                    <div className="list-col today-rise">{quote && Util.renderRisePercent(quote.percentage)}</div>
                    <div className="list-col value"></div>
                    <div className="list-col proportion"></div>
                    <div className="list-col row-oper">
                        {this.renderRecordOper(d)}
                    </div>
                </div>
                {d.closeRecordList && d.closeRecordList.map(d2=>{
                    return this.futuresRenderRecordBlock(d2,g,quote)
                })}
            </div>
            
        )
    }

    /* ================================ futures 相关处理 end ================================ */

    render() {
        let { groupList,type } = this.state;
        
        return (
            <div className="record-list-container">
                {type=='stock' && this.stockRenderBlock()}
                {type=='futures' && this.futuresRenderBlock()}
            </div>
        );
    }
}