import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Input, Select, Collapse, Icon, DatePicker, Tabs, Table, Pagination, Radio, Modal, Tag } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import RecordGroupEdit from "components/Record/RecordGroupEdit/index.jsx";
import RecordEdit from "components/Record/RecordEdit/index.jsx";
import QuoteSwitch from "components/Common/QuoteSwitch/index.jsx";
import { request } from "common/ajax.js";
import { URL, Util, Dict, Config, Data } from "common/config.js";
import './index.scss';




@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordList: [],
            stat:{},
            openSignal:'',
            openType:''
        };
    }

    componentDidMount() {
        this.fetchRecordList();

        this.on('final:stock-quote-refresh-finish', () => {
            this.fetchRecordList();
        })

        this.on('final:record-edit-finish', () => {
            this.fetchRecordList();
        })

    }

    onFilterSelectChange=(name,value)=>{
        this.setState({
            [name]:value
        },this.fetchRecordList)
    }

    onReloadClick=()=>{
        this.fetchRecordList();
    }
    
    fetchRecordList = () => {
        let { openSignal,openType } = this.state;
        const self = this;
        request('/record/getOpenList',
            (res) => {
                let recordList = res.list;
                let stockCodeArray = [];
                for (let d of recordList) {
                    stockCodeArray.push(d.code);
                }
                Data.addCodesToStockQuote(stockCodeArray);
                this.recordListPreProcess(recordList);
                self.setState({
                    recordList: _.cloneDeep(recordList) || []
                })
            }, {
                openSignal,
                openType
            }, 'jsonp')
    }

    recordListPreProcess=(recordList)=>{
        
        let stat = {};
        stat.lossCount = 0; 
        stat.profitCount = 0;
        stat.flatCount = 0;
        stat.maxProfitCate = 0;
        stat.totalProfitCate = 0;
        stat.maxLossCate = 0;
        stat.totalLossCate = 0;
        stat.totalCount=0;
        let index = 1;
        for(let d of recordList){
            let quote = Data.getStockQuote(d.code);
            if(quote){
                d.returns = _.round(d.count * (quote.current-d.price),2);
                d.returnsRate = _.round(((quote.current-d.price) /d.price)*100,2);
                d.value = quote.current * d.remaining
                d.index = index;
                index++;
                stat.totalCount++;
                
                if(d.returnsRate>0){
                    stat.profitCount++
                    stat.totalProfitCate = stat.totalProfitCate + d.returnsRate;
                    if(d.returnsRate>stat.maxProfitCate){
                        stat.maxProfitCate = d.returnsRate
                    }
                }
                if(d.returnsRate==0){
                    stat.flatCount++
                }
                if(d.returnsRate<0){
                    stat.lossCount++
                    stat.totalLossCate = stat.totalLossCate + d.returnsRate;
                    if(d.returnsRate<stat.maxLossCate){
                        stat.maxLossCate = d.returnsRate
                    }
                }
            }
            
        }

        this.setState({
            stat
        })
    }

    onRecordGroupEditClick = (id) => {
        this.emit('final:record-group-edit-show', { id: id })
    }

    onRecordEditClick = (id) => {
        this.emit('final:record-edit-show', { id: id })
    }
    
   

    render() {
        let {  recordList,type,stat,openSignal,openType } = this.state;
        let recordOpenSignal = [{label:'全部',value:''}].concat(Dict.recordOpenSignal);
        let recordOpenType  = [{label:'全部',value:''}].concat(Dict.recordOpenType);
        return (
            <div>
                <div className="ml20 mt20">
                    买入分析
                </div>
                <div className="record-list-container">
                    <div className="list-filter  mt20">
                        <span>
                            <Select style={{width:'120px'}} value={openSignal}  onChange={this.onFilterSelectChange.bind(this,'openSignal')}>
                                {
                                    recordOpenSignal.map(e=>{
                                        return <Select.Option value={e.value}>{e.label}</Select.Option>
                                    })
                                }
                            </Select>
                        </span>
                        <span className="ml20">
                            <Select style={{width:'140px'}} value={openType}  onChange={this.onFilterSelectChange.bind(this,'openType')}>
                                {
                                    recordOpenType.map(e=>{
                                        return <Select.Option value={e.value}>{e.label}</Select.Option>
                                    })
                                }
                            </Select>
                        </span>
                        <span className="ml20"><Button size="small" shape="circle" icon="reload" onClick={this.onReloadClick} /></span>
                        <span className="ml30"><QuoteSwitch /></span>
                    </div>
                    <div  className=" mt20">
                        <div>超级强势股：平台突破，首次10日线，首次20日线，首次50日线；基底突破，首次20日线，首次50日线。</div>
                        <div>非超级强势股：平台突破，首次50日线；基底突破，首次50日线。</div>
                        <div>常见问题：1、短期追高，中线追高、突破追高  2、突破后回调过程中，未等到合适买点着急购买  3、在基底数（第4个及以后）过多时购买</div>
                    </div>
                    
                    <div className=" mt20">
                        
                        <div className="record-list">
                            <Table size="small"
                                title={() => '操作记录'}
                                pagination={false}
                                dataSource={recordList}
                                columns={[{
                                    title: '序号',
                                    dataIndex: 'index',
                                    key: 'index',
                                    width:'50px'
                                }, {
                                    title: '名称',
                                    dataIndex: 'name',
                                    key: 'name',
                                    width:'100px',
                                    render: (text, record) => {
                                        let quote = Data.getStockQuote(record.code);
                                        return (<div>
                                            {quote && quote.name}
                                        </div>)
                                    }
                                }, {
                                    title: '代码',
                                    dataIndex: 'code',
                                    key: 'code'
                                },{
                                    title: '买入时间',
                                    dataIndex: 'open-date',
                                    key: 'open-date',
                                    render: (text, record) => {
                                        return <div>
                                                {record.date}
                                            </div>
                                    }
                                },{
                                    title: '买入价格',
                                    dataIndex: 'open-price',
                                    key: 'open-price',
                                    render: (text, record) => {
                                        return <div>
                                                {record.price}
                                            </div>
                                    }
                                }, {
                                    title: '数量',
                                    dataIndex: 'count',
                                    key: 'count',
                                    render: (text, record) => {
                                        return <div>
                                                {record.count}
                                               
                                            </div>
                                    }
                                },{
                                    title: '买入信号',
                                    dataIndex: 'open-signal',
                                    key: 'open-signal',
                                    render: (text, record) => {
                                        return <div>
                                                {Dict.recordOpenSignalMapper[record.openSignal]}
                                            </div>
                                    }
                                },{
                                    title: '基底',
                                    dataIndex: 'base',
                                    key: 'base',
                                    width:'50px',
                                    render: (text, record) => {
                                        return <div>
                                                {record.base}
                                            </div>
                                    }
                                },{
                                    title: '买入点位',
                                    dataIndex: 'open-type',
                                    key: 'open-type',
                                    render: (text, record) => {
                                        return <div>
                                                {Dict.recordOpenTypeMapper[record.openType]}
                                            </div>
                                    }
                                },{
                                    title: '买入描述',
                                    dataIndex: 'open-description',
                                    key: 'open-description',
                                    width:'150px',
                                    render: (text, record) => {
                                        return <div>
                                                {record.description}
                                            </div>
                                    }
                                }, {
                                    title: '收益率',
                                    dataIndex: 'returnsRate',
                                    key: 'returnsRate',
                                    render: (text, record) => {
                                        return Util.renderRisePercent(record.returnsRate)
                                    }
                                },{
                                    title: '市值',
                                    dataIndex: 'value',
                                    key: 'value',
                                    render: (text, record) => {
                                        return <span>{record.value}</span>
                                    }
                                },{
                                    title: '收益',
                                    dataIndex: 'returns',
                                    key: 'returns',
                                    render: (text, record) => {
                                        return Util.renderRise(record.returns)
                                    }
                                }, {
                                    title: '操作',
                                    dataIndex: 'oper',
                                    key: 'oper',
                                    render: (text, record) => {
                                        return <span>
                                                    <span className="ml10 c-red"><Icon className="c-p" type="edit" title="修改" onClick={this.onRecordEditClick.bind(this, record.id)} /></span>
                                            </span>
                                    }
                                }
                                ]} />
                        </div>
                    </div>


                    <RecordGroupEdit />
                    <RecordEdit />
                </div>

            </div>

        );
    }
}