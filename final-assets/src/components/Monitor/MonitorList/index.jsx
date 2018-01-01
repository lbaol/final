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
        period:'day'
    },{
        count:20,
        period:'day'
    },{
        count:50,
        period:'day'
    },{
        count:120,
        period:'day'
    },
]

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            type:'position',
            typeDS:Dict.favType
        };
    }

    componentDidMount() {
        this.fatchFavList();
    }

    fatchFavList =()=>{
        const self = this;
        const {type} = this.state;
        request('/fav/getByParam',
            (res) => {

                let dataSource = res.favList;
                self.setState({
                    dataSource:dataSource
                },()=>{
                    for(let d of dataSource){
                        this.fatchLastMas(d.code)
                    }
                })
            }, {
                type:'monitor'
            }, 'jsonp')
    }

    

    getLastPriceAndAlert=(code)=>{
        const self = this;
        if (code) {

            request('https://xueqiu.com/stock/forchart/stocklist.json?period=1d&one_min=1',
                (res) => {

                    let curPrice = res.chartlist[res.chartlist.length-1].current;
                    let dataSource = self.state.dataSource;
                    let stock = _.find(dataSource,{code:code});
                    stock.curPrice = curPrice;
                    for(let d of _maDayCounts){
                        let prePrice = stock.preClose;
                        let priceBetween = stock[d.period+d.count];
                        if(prePrice > curPrice ){
                            if(prePrice>=priceBetween && priceBetween>=curPrice){
                                self.addOrUpdateAlert(stock.code,d.period,d.count,priceBetween,curPrice)
                            }
                        }
                    }
                    if(stock.alertPrice){
                        let prePrice = stock.preClose;
                        let priceBetween = stock.alertPrice;
                        if(prePrice > curPrice ){
                            if(prePrice>=priceBetween && priceBetween>=curPrice){
                                self.addOrUpdateAlert(stock.code,'alert','',priceBetween,curPrice)
                            }
                        }
                    }

                }, {
                    symbol: code
                }, 'jsonp')
        }
    }

    addOrUpdateAlert=(code,type,count,alertPrice,timePirce)=>{
        const self = this;
        const m = moment();
        request('/monitor/addOrUpdate',
            (res) => {

                let dataSource = res.favList;
                self.setState({
                    dataSource:dataSource
                },()=>{
                    for(let d of dataSource){
                        this.fatchLastMas(d.code)
                    }
                })
            }, {
                code:code,
                type:type,
                count:count,
                alertPrice:alertPrice,
                timePirce:timePirce,
                time:m.format('YYYY-MM-DD HH:mm:ss'),
                date:m.format('YYYY-MM-DD')
            }, 'jsonp')
    }

    fatchLastMas=(code,period)=> {
        const self = this;
        
        if (code) {
            let newPeriod  = period?period:'day';
            let m = newPeriod == 'week' ?  Config.defaultPeriod.week:Config.defaultPeriod.day;
            let newCode = Util.getFullCode(code);
            let newStartDate =moment().subtract(m, 'day');
            let newEndDate = moment()

            request('https://xueqiu.com/stock/forchartk/stocklist.json?type=before',
                (res) => {

                    let chartList = res.chartlist;
                    let curDayData = chartList[chartList.length-1];
                    let preDayData = chartList[chartList.length-2];

                    let dataSource = self.state.dataSource;
                    let stock = _.find(dataSource,{code:code});
                    
                    for(let d of _maDayCounts){
                        stock[d.period+''+d.count] = Util.getLastMa(chartList,d.count)
                    }
                    stock.preClose = preDayData.close; 
                    stock.close = curDayData.close; 

                    self.setState({
                        dataSource:dataSource
                    },()=>{
                        setInterval(()=>{
                            self.getLastPriceAndAlert(code)
                        },10000)
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
        const {type} = this.state;
        const alertPrice = e.target.value;
        request('/fav/updateById',
            (res) => {
                let {dataSource} = this.state;
                dataSource[index].alertPrice = alertPrice;
                self.setState({
                    dataSource:dataSource
                })
            }, {
                id:record.id,
                alertPrice:alertPrice
            }, 'jsonp')
    }

    

    render() {
        const {dataSource} = this.state;
        const {stockDict} = this.props;
        const pagination = {
            total:dataSource.length,
            pageSize:1000
        }
        return (
            <div>
                <div>
                    <FavImport/>
                </div>
                <div className="mt10">
                    <Table size="small" className="monitor-list-table"
                        pagination={false}
                        dataSource={dataSource}
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
                            key:'day10'
                        },{
                            title: '20日',
                            dataIndex: 'day20',
                            key:'day20'
                        },{
                            title: '50日',
                            dataIndex: 'day50',
                            key:'day50'
                        },{
                            title: '120日',
                            dataIndex: 'day120',
                            key:'day120'
                        },
                        {
                            title: '目标价',
                            dataIndex: 'alertPrice',
                            key:'alertPrice',
                            render: (text, record, index) => {
                                
                                return (<div>
                                    <Input size="small" style={{width:'50px'}} defaultValue={text} onChange={this.onTargetInputChange.bind(this,index,record)}/>
                                </div>)
                            }
                        },
                        {
                            title: '昨日收盘',
                            dataIndex: 'preClose',
                            key:'preClose'
                        },{
                            title: '今日收盘',
                            dataIndex: 'close',
                            key:'close'
                        },{
                            title: '当前价格',
                            dataIndex: 'curPrice',
                            key:'curPrice'
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
                        }
                        ]}  />
                </div>
                        

            </div>
        );
    }
}