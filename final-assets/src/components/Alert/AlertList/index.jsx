import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button,Input, Select, Icon, DatePicker, Tabs, Table,Pagination ,Radio,Modal} from 'antd';
import FEvents from "../../FEvent/index.js";
import { request } from "../../../common/ajax.js";
import { URL, Util,Dict,Config } from "../../../common/config.js";
import FavImport from "../../Fav/FavImport/index.jsx";
import './index.scss';


let _maDayCounts = [
    {
        count:10,
        type:'day'
    },{
        count:20,
        type:'day'
    },{
        count:50,
        type:'day'
    },{
        count:120,
        type:'day'
    },
]

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stockDataSource: [],
            alertDataSource:[],
            alertMapper:{},
            positionDataSource:[],
            typeDS:Dict.favType,
            quoteMapper:{},
            codes:[]
        };
    }

    componentDidMount() {
        this.fatctMonitorList();
        this.fatctPositionList();
        this.getAlertList();
    }

    fatctMonitorList =()=>{
        const self = this;
        request('/fav/getByParam',
            (res) => {

                let stockDataSource = res.favList;
                for(let d of stockDataSource){
                    this.state.codes.push(d.code);
                }
                
                self.setState({
                    stockDataSource:stockDataSource,
                    codes:_.sortedUniq(this.state.codes)
                },()=>{
                    for(let d of stockDataSource){
                        this.fatchLastMas(d.code)
                    }
                    setTimeout(()=>{
                        self.getLastQuote(self.checkAlert)
                    },3000)
                })
            }, {
                type:'monitor'
            }, 'jsonp')
    }

    

    fatctPositionList =()=>{
        const self = this;
        request('/fav/getByParam',
            (res) => {

                for(let d of res.favList){
                    this.state.codes.push(d.code);
                }

                self.setState({
                    positionDataSource:res.favList,
                    codes:_.sortedUniq(this.state.codes)
                },this.getLastQuote)
            }, {
                type:'position'
            }, 'jsonp')
    }

    getAlertList=()=>{
        const self = this;
        request('/alert/getByParams',
        (res) => {

            if(res.monitorList){
                let alertMapper = {}
                for(let d of res.monitorList){
                    alertMapper[self.getAlertMapperKey(d.code,d.type,d.count)] = d
                }

                self.setState({
                    alertDataSource:res.monitorList,
                    alertMapper:alertMapper
                })
            }
        }, {
            startDate:moment().add('day',-2).format('YYYY-MM-DD')
        }, 'jsonp')
    }


    getLastQuote = (callback)=>{
        let {codes} = this.state;
        let reqCodes = codes.map(d=>Util.getFullCode(d))
        const self = this;
        request('https://xueqiu.com/v4/stock/quote.json',
        (res) => {

            let quoteMapper = {};
            for(let k in res){
                quoteMapper[k.substring(2)] = res[k]
            }

            if(callback){
                self.setState({
                    quoteMapper:quoteMapper
                },callback)
            }else{
                self.setState({
                    quoteMapper:res
                })
            }
            
            
        }, {
            code: reqCodes.join(',')
        }, 'jsonp')
    }

    

    checkAlert=()=>{
        let {stockDataSource,quoteMapper} = this.state;
                
        for(let stock of stockDataSource){
            let curQuota = quoteMapper[stock.code];
            if(curQuota && curQuota.current){
                let curPrice = curQuota.current;
                stock.curPrice = curPrice;
                for(let d of _maDayCounts){
                    let prePrice = stock.preClose;
                    let priceBetween = stock[d.type+d.count];
                    let priceBetween2 = priceBetween*1.01;  //接近目标价格1个点时就提醒
                    if(prePrice > curPrice ){
                        if(prePrice>=priceBetween && priceBetween2>=curPrice){
                            let time = moment(curQuota.time).format('YYYY-MM-DD HH:mm:ss');
                            this.addOrUpdateAlert(stock.code,d.type,d.count,priceBetween,curPrice,time)
                        }
                    }
                }
                if(stock.alertPrice){
                    let prePrice = stock.preClose;
                    let priceBetween = stock.alertPrice;
                    if(prePrice > curPrice ){
                        if(prePrice>=priceBetween && priceBetween>=curPrice){
                            this.addOrUpdateAlert(stock.code,'alert','',priceBetween,curPrice)
                        }
                    }
                }
            }
            
        }
        this.setState({
            stockDataSource:stockDataSource
        })
    }

    addOrUpdateAlert=(code,type,count,alertPrice,timePrice,time)=>{
        const self = this;
        const m = moment();
        request('/alert/addOrUpdate',
            (res) => {
                console.log(res,code,type,count,alertPrice,timePrice,time)
            }, {
                code:code,
                type:type,
                count:count,
                alertPrice:alertPrice,
                timePrice:timePrice,
                time:time?time:m.format('YYYY-MM-DD HH:mm:ss'),
                date:m.format('YYYY-MM-DD')
            }, 'jsonp')
    }

    

    fatchLastMas=(code,type)=> {
        const self = this;
        
        if (code) {
            let newPeriod  = type?type:'day';
            let m = newPeriod == 'week' ?  Config.defaultPeriod.week:Config.defaultPeriod.day;
            let newCode = Util.getFullCode(code);
            let newStartDate =moment().subtract(m, 'day');
            let newEndDate = moment()

            request('https://xueqiu.com/stock/forchartk/stocklist.json?type=before',
                (res) => {

                    let chartList = res.chartlist;
                    let curDayData = chartList[chartList.length-1];
                    let preDayData = chartList[chartList.length-2];

                    let stockDataSource = self.state.stockDataSource;
                    let stock = _.find(stockDataSource,{code:code});
                    
                    for(let d of _maDayCounts){
                        stock[d.type+''+d.count] = Util.getLastMa(chartList,d.count)
                    }
                    stock.preClose = preDayData.close; 
                    stock.close = curDayData.close; 

                    self.setState({
                        stockDataSource:stockDataSource
                    })

                }, {
                    symbol: newCode,
                    period: '1' + newPeriod,
                    begin: newStartDate.set('hour', 0).set('minute', 0).format('x'),
                    end: newEndDate.set('hour', 23).set('minute', 59).format('x'),

                }, 'jsonp')
        }
    }

    onTargetInputChange=(index,record,e)=>{
        const self = this;
        const alertPrice = e.target.value;
        request('/fav/updateById',
            (res) => {
                let {stockDataSource} = this.state;
                stockDataSource[index].alertPrice = alertPrice;
                self.setState({
                    stockDataSource:stockDataSource
                })
            }, {
                id:record.id,
                alertPrice:alertPrice
            }, 'jsonp')
    }


    onNumberInputChange=(index,record,e)=>{
        const self = this;
        const number = e.target.value;
        request('/fav/updateById',
            (res) => {
                let {positionDataSource} = this.state;
                positionDataSource[index].number = number;
                self.setState({
                    positionDataSource:positionDataSource
                })
            }, {
                id:record.id,
                number:number
            }, 'jsonp')
    }

    getAlertMapperKey(code,type,count){
        return code+'-'+type+'-'+count;
    }

    renderTypeCountCell=(type,count,text,record)=>{
        let {alertMapper} = this.state;
        let alertDetail = alertMapper[this.getAlertMapperKey(record.code,type,count)];
        // console.log(alertMapper)
        // console.log(record.code,type,count,alertDetail)
        if(alertDetail){
            return <span className="alert-bg">{text}</span>
        }
        return text;
    }
    

    render() {
        const {stockDataSource,alertDataSource,positionDataSource,quoteMapper} = this.state;
        const {stockDict} = this.props;
        return (
            <div class="alert-list-container">
                <div>
                    <FavImport/>
                </div>
                <div className="mt10">
                    <Table size="small"
                        title={()=>'监控列表'}
                        pagination={false}
                        dataSource={stockDataSource}
                        columns={[{
                            title: '名称',
                            dataIndex: 'name',
                            key:'name',
                            render: (text, record) => {
                                let stock = stockDict[record.code];
                                return (<div>
                                    {stock && stock.name}
                                </div>)
                            }
                        },{
                            title: '代码',
                            dataIndex: 'code',
                            key:'code'
                        },{
                            title: '10日',
                            dataIndex: 'day10',
                            key:'day10',
                            render: (text,record)=>{
                                return this.renderTypeCountCell('day',10,text,record)
                            }
                        },{
                            title: '20日',
                            dataIndex: 'day20',
                            key:'day20',
                            render: (text,record)=>{
                                return this.renderTypeCountCell('day',20,text,record)
                            }
                        },{
                            title: '50日',
                            dataIndex: 'day50',
                            key:'day50',
                            render: (text,record)=>{
                                return this.renderTypeCountCell('day',50,text,record)
                            }
                        },{
                            title: '120日',
                            dataIndex: 'day120',
                            key:'day120',
                            render: (text,record)=>{
                                return this.renderTypeCountCell('day',120,text,record)
                            }
                        },
                        {
                            title: '昨日收盘',
                            dataIndex: 'preClose',
                            key:'preClose'
                        },{
                            title: '当前价格',
                            dataIndex: 'curPrice',
                            key:'curPrice'
                        },{
                            title: '涨幅',
                            dataIndex: 'rise',
                            key:'rise',
                            render: (text, record, index) => {
                                
                                return (<div>
                                    {record.curPrice && record.preClose && _.round((record.curPrice/record.preClose-1)*100,2)}%
                                </div>)
                            }
                        },
                        {
                            title: '操作',
                            dataIndex: 'action',
                            key:'action',
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
                            key:'alertPriceSet',
                            render: (text, record, index) => {
                                
                                return (<div>
                                    <Input size="small" style={{width:'50px'}} defaultValue={text} onChange={this.onTargetInputChange.bind(this,index,record)}/>
                                </div>)
                            }
                        }
                        ]}  />
                </div>
                <div className="mt30">
                    <Table size="small" 
                        title={()=>'报警列表'}
                        pagination={false}
                        dataSource={alertDataSource}
                        columns={[{
                            title: '名称',
                            dataIndex: 'name',
                            key:'name',
                            render: (text, record) => {
                                let stock = stockDict[record.code];
                                return (<div>
                                    {stock && stock.name}
                                </div>)
                            }
                        },{
                            title: '代码',
                            dataIndex: 'code',
                            key:'code'
                        },{
                            title: 'count',
                            dataIndex: 'count',
                            key:'count'
                        },{
                            title: 'type',
                            dataIndex: 'type',
                            key:'type'
                        },{
                            title: '提醒价格',
                            dataIndex: 'alertPrice',
                            key:'alertPrice'
                        },{
                            title: '当时价格',
                            dataIndex: 'timePrice',
                            key:'timePrice'
                        },{
                            title: '提醒时间',
                            dataIndex: 'time',
                            key:'time'
                        },
                        
                        ]}  />
                </div>
                <div className="mt30">
                    <Table size="small"
                        pagination={false}
                        dataSource={positionDataSource}
                        columns={[{
                            title: '名称',
                            dataIndex: 'name',
                            key:'name',
                            render: (text, record) => {
                                let stock = stockDict[record.code];
                                return (<div>
                                    {stock && stock.name}
                                </div>)
                            }
                        },{
                            title: '代码',
                            dataIndex: 'code',
                            key:'code'
                        },{
                            title: '数量',
                            dataIndex: 'number',
                            key:'number'
                        },
                        {
                            title: '市值',
                            dataIndex: 'number',
                            key:'marketValue',
                            render: (text, record, index) => {
                                let marketValue;
                                let quote = quoteMapper[record.code];
                                // console.log(text, record, index,record.number,quoteMapper[record.code])
                                if(record.number && quote){
                                    marketValue=_.round(record.number * quote.current);
                                }
                                return (<div>{marketValue}</div>)
                            }
                        },
                        {
                            title: '数量设置',
                            dataIndex: 'number',
                            key:'numberSet',
                            render: (text, record, index) => {
                                
                                return (<div>
                                    <Input size="small" style={{width:'50px'}} defaultValue={text} onChange={this.onNumberInputChange.bind(this,index,record)}/>
                                </div>)
                            }
                        }
                        
                        ]}  />
                </div>
            </div>
        );
    }
}