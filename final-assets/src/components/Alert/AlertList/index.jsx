import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Input, Select, Collapse, Icon, DatePicker, Tabs, Table, Pagination, Radio, Modal } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import NoteEdit from "components/Note/NoteEdit/index.jsx";
import PosEdit from "components/Pos/PosEdit/index.jsx";
import { request } from "common/ajax.js";
import { URL, Util, Dict, Config } from "common/config.js";
import FavImport from "components/Fav/FavImport/index.jsx";
import './index.scss';


let _maDayCounts = [
    {
        count: 10,
        type: 'day'
    }, {
        count: 20,
        type: 'day'
    }, {
        count: 50,
        type: 'day'
    }, {
        count: 120,
        type: 'day'
    },
]

const intervalTime = Config.alertList.intervalTime;
const doInterval = Config.alertList.doInterval;

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stockDataSource: [],
            alertDataSource: [],
            alertMapper: {},
            positionDataSource: [],
            typeDS: Dict.favType,
            quoteMapper: {},
            codes: [],
            eventMapper:{},
            posDS:{},
            isPosItemVisable:false

        };
    }

    componentDidMount() {
        
        this.fetchMonitorList();
        this.fetchPositionList2();
        if (doInterval == true) {
            setInterval(this.getAlertList, 5000)
        } else {
            setTimeout(this.getAlertList, intervalTime)
        }

        this.on('final:fav-import-finish', () => {
            this.refreshList();
        })

        this.on('final:pos-edit-finish', () => {
            this.fetchPositionList2()
        })
        

    }

    fetchMonitorList = () => {
        const self = this;
        request('/fav/getByParam',
            (res) => {

                let stockDataSource = res.favList;
                for (let d of stockDataSource) {
                    this.state.codes.push(d.code);
                    self.getEventsByCode(d.code)
                }

                self.setState({
                    stockDataSource: stockDataSource,
                    codes: _.sortedUniq(this.state.codes)
                }, () => {
                    for (let d of stockDataSource) {
                        this.fetchLastMas(d.code)
                    }

                    if (doInterval == true) {
                        setInterval(() => {
                            self.getLastQuote(self.checkAlert)
                        }, intervalTime)
                    } else {
                        setTimeout(() => {
                            self.getLastQuote(self.checkAlert)
                        }, 5000)
                    }
                })
            }, {
                type: 'monitor'
            }, 'jsonp')
    }



  

    fetchPositionList2 = () => {
        const self = this;
        request('/pos/getAll',
            (res) => {
                let posDS = {};
                for (let d of res.posList) {
                    this.state.codes.push(d.code)
                    if(!posDS[d.code]){
                        posDS[d.code] = {};
                        posDS[d.code] = {
                            ...d
                        }
                        posDS[d.code].list = [];
                    }else{
                        let currentPos = posDS[d.code];
                        currentPos.number = currentPos.number + d.number
                    }
                    
                    posDS[d.code].list.push(d);
                }

                for (let k in posDS){
                    self.preProcessPos(posDS[k])
                }

                self.setState({
                    posDS: posDS,
                    codes: _.sortedUniq(this.state.codes)
                }, this.getLastQuote)
            }, {
            }, 'jsonp')
    }

    getAlertList = () => {
        const self = this;
        request('/alert/getByParams',
            (res) => {

                if (res.alertList) {
                    let alertMapper = {}
                    for (let d of res.alertList) {
                        alertMapper[self.getAlertMapperKey(d.code, d.type, d.count)] = d
                    }

                    self.setState({
                        alertDataSource: res.alertList,
                        alertMapper: alertMapper
                    })
                }
            }, {
                startDate: moment().add('day', -2).format('YYYY-MM-DD')
            }, 'jsonp')
    }




    getLastQuote = (callback) => {
        let { codes } = this.state;
        let reqCodes = codes.map(d => Util.getFullCode(d))
        const self = this;
        request('https://xueqiu.com/v4/stock/quote.json',
            (res) => {

                let quoteMapper = {};
                for (let k in res) {
                    quoteMapper[k] = res[k]
                }
                // console.log(quoteMapper)

                if (callback) {
                    self.setState({
                        quoteMapper: quoteMapper
                    }, callback)
                } else {
                    self.setState({
                        quoteMapper: res
                    })
                }


            }, {
                code: reqCodes.join(',')
            }, 'jsonp')
    }

    onFavImportClick = () => {
        this.emit('final:fav-import-show')
    }


    onPosAddClick = () => {
        this.emit('final:pos-edit-show')
    }

    onPosListCollapseClick = () => {
        let {posDS,isPosItemVisable} = this.state;
        let visible = !isPosItemVisable;
        for(let k in posDS){
            posDS[k].visible = visible;
        }
        this.setState({
            posDS:posDS,
            isPosItemVisable:visible
        })
    }

    onPosEditClick= (id) => {
        this.emit('final:pos-edit-show',{id:id})
    }

    onPosDeleteClick=(id)=>{
        const self = this;
        Modal.confirm({
            title: '确定不是手抖点的删除?',
            content: '',
            onOk() {
                request('/pos/deleteById',
                    (res) => {
                        self.fetchPositionList2()
                    }, {
                        id: id
                    }, 'jsonp')
            },
            onCancel() {},
          })
    }
    
    onShowPosDetailClick=(code)=>{
        let {posDS} = this.state;
        if(posDS[code]){
            posDS[code].visible = !posDS[code].visible;
        }
        this.setState({posDS})
    }

    sumTotalValue = (positionDataSource, quoteMapper) => {
        let totalValue = 0;
        for (let d of positionDataSource) {
            if (quoteMapper[Util.getFullCode(d.code)]) {
                let current = quoteMapper[Util.getFullCode(d.code)].current;
                if (_.isNumber(_.toNumber(current))) {
                    totalValue = totalValue + _.round(d.number * current)
                }
            }
        }
        return totalValue;
    }

    sumTotalValue2 = (posDS, quoteMapper) => {
        let totalValue = 0;
        for (let k in posDS) {
            if (quoteMapper[Util.getFullCode(k)]) {
                let current = quoteMapper[Util.getFullCode(k)].current;
                if (_.isNumber(_.toNumber(current))) {
                    totalValue = totalValue + _.round(posDS[k].number * current)
                }
            }
        }
        return totalValue;
    }

    checkEventByType=(code,type)=>{
        const {eventMapper} = this.state;
        if(_.isArray(eventMapper[code]) && eventMapper[code].length>0){
            if(_.findIndex(eventMapper[code],{type:type})!=-1){
                return true;
            }
        }
        return false;
    }

    getEventsByCode=(code)=>{
        const self = this;
        request('/event/getByParams',
            (res) => {

                if (res.eventList) {
                    let eventMapper = self.state.eventMapper
                    eventMapper[code] = res.eventList;

                    self.setState({
                        eventMapper: eventMapper
                    })
                }
            }, {
                startDate: moment().add('day', -200).format('YYYY-MM-DD'),
                code:code
            }, 'jsonp')
    }


    checkAlert = () => {
        let { stockDataSource, quoteMapper } = this.state;

        for (let stock of stockDataSource) {
            let curQuota = quoteMapper[Util.getFullCode(stock.code)];
            if (curQuota && curQuota.current) {
                let curPrice = curQuota.current;
                stock.curPrice = curPrice;
                for (let d of _maDayCounts) {
                    let prePrice = stock.preClose;
                    let priceBetween = stock[d.type + d.count];
                    let priceBetween2 = priceBetween * 1.01;  //接近目标价格1个点时就提醒
                    if (prePrice > curPrice) {
                        if (prePrice >= priceBetween && priceBetween2 >= curPrice) {
                            let time = moment(curQuota.time).format('YYYY-MM-DD HH:mm:ss');
                            this.addOrUpdateAlert(stock.code, d.type, d.count, priceBetween, curPrice, time)
                        }
                    }
                }
                if (stock.alertPrice) {
                    let prePrice = stock.preClose;
                    let priceBetween = stock.alertPrice;
                    if (prePrice > curPrice) {
                        if (prePrice >= priceBetween && priceBetween >= curPrice) {
                            this.addOrUpdateAlert(stock.code, 'alert', '', priceBetween, curPrice)
                        }
                    }
                }
            }

        }
        this.setState({
            stockDataSource: stockDataSource
        })
    }

    addOrUpdateAlert = (code, type, count, alertPrice, timePrice, time) => {
        const self = this;
        const m = moment();
        request('/alert/addOrUpdate',
            (res) => {
                // console.log(res, code, type, count, alertPrice, timePrice, time)
            }, {
                code: code,
                type: type,
                count: count,
                alertPrice: alertPrice,
                timePrice: timePrice,
                time: time ? time : m.format('YYYY-MM-DD HH:mm:ss'),
                date: m.format('YYYY-MM-DD')
            }, 'jsonp')
    }



    fetchLastMas = (code, type) => {
        const self = this;

        if (code) {
            let newPeriod = type ? type : 'day';
            let newCode = Util.getFullCode(code);
            let newStartDate = moment().subtract(300, 'day');
            let newEndDate = moment()

            request('https://xueqiu.com/stock/forchartk/stocklist.json?type=before',
                (res) => {

                    let chartList = res.chartlist;
                    let curDayData = chartList[chartList.length - 1];
                    let preDayData = chartList[chartList.length - 2];

                    let stockDataSource = self.state.stockDataSource;
                    let stock = _.find(stockDataSource, { code: code });

                    for (let d of _maDayCounts) {
                        stock[d.type + '' + d.count] = Util.getLastMa(chartList, d.count)
                    }
                    stock.preClose = preDayData.close;
                    stock.close = curDayData.close;

                    self.setState({
                        stockDataSource: stockDataSource
                    })

                }, {
                    symbol: newCode,
                    period: '1' + newPeriod,
                    begin: newStartDate.set('hour', 0).set('minute', 0).format('x'),
                    end: newEndDate.set('hour', 23).set('minute', 59).format('x'),

                }, 'jsonp')
        }
    }

    onTargetInputChange = (index, record, e) => {
        const self = this;
        const alertPrice = e.target.value;
        request('/fav/updateById',
            (res) => {
                let { stockDataSource } = this.state;
                stockDataSource[index].alertPrice = alertPrice;
                self.setState({
                    stockDataSource: stockDataSource
                })
            }, {
                id: record.id,
                alertPrice: alertPrice
            }, 'jsonp')
    }


    onNumberInputChange = (index, record, e) => {
        const self = this;
        const number = e.target.value;
        request('/fav/updateById',
            (res) => {
                let { positionDataSource } = this.state;
                positionDataSource[index].number = number;
                self.setState({
                    positionDataSource: positionDataSource
                })
            }, {
                id: record.id,
                number: number
            }, 'jsonp')
    }

    getAlertMapperKey(code, type, count) {
        return code + '-' + type + '-' + count;
    }

    refreshList=()=>{
        this.fetchMonitorList();
        this.fetchPositionList();
    }

    onDeleteFavByIdClick = (id) => {
        const self = this;
        Modal.confirm({
            title: '确定不是手抖点的删除?',
            content: '',
            onOk() {
                request('/fav/deleteById',
                    (res) => {
                        self.refreshList()
                    }, {
                        id: id
                    }, 'jsonp')
            },
            onCancel() {},
          })
        
    }

    preProcessPos=(curPos)=>{
        if(curPos && curPos.list){
            let totalValue = 0;
            let totalNumber = 0;
            for(let d of curPos.list){
                totalValue = totalValue + (d.number*d.cost);
                totalNumber = totalNumber + d.number;
            }
            curPos.cost =  _.round(totalValue/totalNumber,2);
            curPos.number = totalNumber;
        }
    }

    onEditDefaultNoteClick=(code)=>{
        this.emit('final:note-default-edit-show',{
            code:code
        })
    }

    getPosWarningClass = (pos,quote)=>{
        
        if(pos && pos.list && quote){
            for(let d of pos.list){
                let ret = _.round((quote.current-d.cost)/d.cost*100,2);
                if(ret<=-8){
                    console.log('warn',d.code,ret)
                    return 'warn'
                }
            }
        }
    }

    renderTypeCountCell = (type, count, text, record) => {
        let { alertMapper } = this.state;
        let alertDetail = alertMapper[this.getAlertMapperKey(record.code, type, count)];
        // console.log(alertMapper)
        // console.log(record.code,type,count,alertDetail)
        if (alertDetail) {
            return <span className="alert-bg">{text}</span>
        }
        return text;
    }

    renderOperCell = (text, record) => {
        return (<div>
            <Icon type="delete" className="c-p" onClick={this.onDeleteFavByIdClick.bind(this, record.id)} />
            <span className="ml10">
                <Icon className="c-p" type="file-text" onClick={this.onEditDefaultNoteClick.bind(this, record.code)} />
            </span>
        </div>)
    }

    renderEventTypeCell = (code,type) => {
        return this.checkEventByType(code,type)==true?<Icon type="check" />:''
    }
    

    render() {
        const { stockDataSource, alertDataSource, positionDataSource, quoteMapper,posDS } = this.state;
        const { stockDict } = this.props;
        const totalValue = this.sumTotalValue(positionDataSource, quoteMapper);
        const totalValue2 = this.sumTotalValue2(posDS,quoteMapper)
        const indexDataSource = Dict.indexType;
        return (
            <div className="alert-list-container">
                <div className="pt10 pb10 pl10">
                    <span >
                        <Icon className="c-p" type="plus-circle-o" onClick={this.onFavImportClick} />
                    </span>
                    <FavImport />
                </div>
                <div className="o-h">
                    <div className="f-l">
                        <Table size="small"
                            title={() => '监控列表'}
                            pagination={false}
                            dataSource={stockDataSource}
                            columns={[{
                                title: '名称',
                                dataIndex: 'name',
                                key: 'name',
                                render: (text, record) => {
                                    return (<div>
                                        {Util.getStockName(record.code)}
                                    </div>)
                                }
                            }, {
                                title: '代码',
                                dataIndex: 'code',
                                key: 'code',
                                render: (text, record) => {
                                    return (<a target="_blank"  href={'/detail.html?codes='+text}>{record.code}</a>)
                                }
                            }, {
                                title: '10日',
                                dataIndex: 'day10',
                                key: 'day10',
                                render: (text, record) => {
                                    return this.renderTypeCountCell('day', 10, text, record)
                                }
                            }, {
                                title: '20日',
                                dataIndex: 'day20',
                                key: 'day20',
                                render: (text, record) => {
                                    return this.renderTypeCountCell('day', 20, text, record)
                                }
                            }, {
                                title: '50日',
                                dataIndex: 'day50',
                                key: 'day50',
                                render: (text, record) => {
                                    return this.renderTypeCountCell('day', 50, text, record)
                                }
                            }, {
                                title: '120日',
                                dataIndex: 'day120',
                                key: 'day120',
                                render: (text, record) => {
                                    return this.renderTypeCountCell('day', 120, text, record)
                                }
                            }, {
                                title: '领先新高',
                                dataIndex: 'code',
                                key: 'leadNewHigh',
                                render: (text, record) => {
                                    return this.renderEventTypeCell(record.code,'leadNewHigh')
                                }
                            }, {
                                title: '断层',
                                dataIndex: 'code',
                                key: 'fault',
                                render: (text, record) => {
                                    return this.renderEventTypeCell(record.code,'fault')
                                }
                            }, {
                                title: '杯柄',
                                dataIndex: 'code',
                                key: 'handle',
                                render: (text, record) => {
                                    return this.renderEventTypeCell(record.code,'handle')
                                }
                            }, {
                                title: '突破',
                                dataIndex: 'code',
                                key: 'breakThrough',
                                render: (text, record) => {
                                    return this.renderEventTypeCell(record.code,'breakThrough')
                                }
                            }, {
                                title: '当前价格',
                                dataIndex: 'curPrice',
                                key: 'curPrice',
                                render: (text, record, index) => {
                                    let marketValue;
                                    let quote = quoteMapper[Util.getFullCode(record.code)];
                                    return quote && quote.current
                                }
                            }, {
                                title: '涨幅',
                                dataIndex: 'rise',
                                key: 'rise',
                                render: (text, record, index) => {
                                    let marketValue;
                                    let quote = quoteMapper[Util.getFullCode(record.code)];
                                    return Util.renderRisePercent(quote && quote.percentage) 
                                }
                            },
                            {
                                title: '快链',
                                dataIndex: 'link',
                                key: 'link',
                                render: (text, record) => {

                                    return (<div>
                                        <span className="ml5">
                                            {Util.getXueQiuStockLink(record.code)}
                                        </span>
                                        <span className="ml5">
                                            {Util.getDongCaiStockLink(record.code)}
                                        </span>
                                    </div>)
                                }
                            },
                            {
                                title: '提醒价格设置',
                                dataIndex: 'alertPrice',
                                key: 'alertPriceSet',
                                render: (text, record, index) => {

                                    return (<div>
                                        <Input size="small" style={{ width: '50px' }} defaultValue={text} onChange={this.onTargetInputChange.bind(this, index, record)} />
                                    </div>)
                                }
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                key: 'action',
                                render: this.renderOperCell
                            }
                            ]} />
                    </div>
                    <div className="f-l ml20">
                        <div class="alert-table-wrap">
                            <Table size="small"
                                title={() => '报警列表'}
                                pagination={false}
                                dataSource={alertDataSource}
                                columns={[{
                                    title: '名称',
                                    dataIndex: 'name',
                                    key: 'name',
                                    render: (text, record) => {
                                        return (<div>
                                            {Util.getStockName(record.code)}
                                        </div>)
                                    }
                                }, {
                                    title: '代码',
                                    dataIndex: 'code',
                                    key: 'code'
                                }, {
                                    title: 'count',
                                    dataIndex: 'count',
                                    key: 'count'
                                }, {
                                    title: 'type',
                                    dataIndex: 'type',
                                    key: 'type'
                                }, {
                                    title: '提醒价格',
                                    dataIndex: 'alertPrice',
                                    key: 'alertPrice'
                                }, {
                                    title: '当时价格',
                                    dataIndex: 'timePrice',
                                    key: 'timePrice'
                                }, {
                                    title: '提醒时间',
                                    dataIndex: 'time',
                                    key: 'time'
                                },

                                ]} />
                        </div>
                        
                    </div>
                </div>

                
                <div className="mt30 mb30 ml20 pos-list">
                    <div>
                        <span>
                            {totalValue2}
                        </span>
                        <span className="ml20">
                            <Icon className="c-p" type="plus-circle-o" onClick={this.onPosAddClick} />
                        </span>
                        <span className="ml10">
                            <Icon className="c-p"  type="profile" onClick={this.onPosListCollapseClick} />
                        </span>
                    </div>
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
                    {Object.keys(posDS).map(k=>{
                        let quote = quoteMapper[Util.getFullCode(k)];
                        return <div className="pos">
                            <div className="pos-item-total">
                                <div className="list-col name">{Util.getStockName(k)}</div>
                                <div className="list-col code">{posDS[k].code}</div>
                                <div className="list-col number">{posDS[k].number}</div>
                                <div className="list-col cost">{posDS[k].cost}</div>
                                <div className={"list-col returns "+this.getPosWarningClass(posDS[k],quote)}>{quote && Util.renderRisePercent(_.round((quote.current-posDS[k].cost)/posDS[k].cost*100,2))}</div>
                                <div className="list-col current">{quote && quote.current}</div>
                                <div className="list-col rise">{quote && Util.renderRisePercent(quote.percentage)}</div>
                                <div className="list-col value">{_.round(posDS[k].number * (quote && quote.current))}</div>
                                <div className="list-col proportion">{quote && _.round(posDS[k].number * quote.current/totalValue2*100)}%</div>
                                <div className="list-col oper">
                                    <Icon className="c-p" type="down" onClick={this.onShowPosDetailClick.bind(this,k)} />{posDS[k].list.length>1?<span>({posDS[k].list.length})</span>:''}
                                </div>
                            </div>
                            {
                                posDS[k].visible == true && posDS[k].list.map(d=>{
                                    let ret = _.round((quote.current-d.cost)/d.cost*100,2);
                                    return (<div  className="pos-item">
                                        <div className="list-col name">{Util.getStockName(d.code)}</div>
                                        <div className="list-col code">{d.code}</div>
                                        <div className="list-col number">{d.number}</div>
                                        <div className="list-col cost">{d.cost}</div>
                                        <div className={"list-col returns "+((ret<=-8)?'warn':'')}>{quote && Util.renderRisePercent(ret)}</div>
                                        <div className="list-col current"></div>
                                        <div className="list-col rise"></div>
                                        <div className="list-col value">{quote && _.round(d.number *  quote.current)}</div>
                                        <div className="list-col proportion">{quote && _.round(d.number * quote.current/totalValue2*100)}%</div>
                                        <div className="list-col oper">
                                            <span><Icon className="c-p" type="edit" onClick={this.onPosEditClick.bind(this,d.id)} /></span>
                                            <span className="ml20"><Icon className="c-p" type="delete" onClick={this.onPosDeleteClick.bind(this,d.id)} /></span>
                                        </div>
                                    </div>)
                                })
                            }
                        </div>
                    })}
                    
                </div>
                <NoteEdit/>
                <PosEdit/>
            </div>
        );
    }
}