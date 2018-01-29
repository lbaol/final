import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Radio , Modal,Select, Icon,Card} from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import EventEditMin from "components/Event/EventEditMin/index.jsx";
import { request } from "common/ajax.js";
import { URL, Util ,Dict} from "common/config.js";
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
           code:props.code,
           eventList:[],
           type:''
        };
    }

    componentWillMount(){
    }

    componentDidMount() {

        this.on('final:event-edit-finish', () => {
            this.emitRefresh()
        });

        this.on('final:event-list-refresh', () => {
            this.emitRefresh()
        });

        this.fetchEventList();
    }

    emitRefresh=()=>{
        this.fetchEventList()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('code') && !_.isEqual(this.state.code, nextProps.code)) {
            this.setState({
                code: nextProps.code
            }, this.fetchEventList)
        }
    }

    fetchEventList=()=>{
        const self = this;
        const {code,type} = this.state;
        request('/event/getByParams',
		(res)=>{

            
            let eventList = res.eventList;

            eventList = _.orderBy(eventList, ['eventDate'], ['desc']);
            

			self.setState({
                eventList:eventList
            })
		},{
            code:code,
            type:type
        },'jsonp')
    }
    
    onAddEventClick=(eventDate)=>{
        const {code} = this.state;
        this.emit('final:event-edit-show',{code:code,eventDate:eventDate?eventDate:''})
    }

    onTypeChange=(e)=>{
        this.setState({
            type:e.target.value
        },this.fetchEventList)
    }

    onDeleteEventClick=(id)=>{
        const self = this;
        const {code} = this.state;
        Modal.confirm({
            title: '确定不是手抖点的删除  ?',
            content: '',
            onOk() {
                request('/event/deleteById',
                    (res)=>{
                        self.fetchEventList()
                        self.emit('final:stock-chart-refresh',{code:code})
                    },{
                        id:id
                    },'jsonp')
            },
            onCancel() {},
          })
    }

    render() {
        const {eventList,code,type} = this.state;
        const name = Util.getStockName(code) + ' ' + code;
        // console.log('render 信号'+' - '+name)

        return (
            <div className="event-block">
                <Card title={'信号'+' - '+name} bordered={false}  extra={<EventEditMin code={code}/>} >
                    <Radio.Group  value={type} onChange={this.onTypeChange}  size="small">
                        <Radio.Button value="">全部</Radio.Button>
                        {
                            Dict.eventType.map(d=>{
                                return <Radio.Button value={d.value}>{d.label}</Radio.Button>
                            })
                        }
                    </Radio.Group>
                    {
                        eventList && eventList.map((ev)=>{
                            let content ;
                            if(ev.type=='report'){
                                content = (<span>
                                    <span>
                                        <span className="c-blue">{ev.quarter}季度 报告</span> 
                                        <span>{ev.profitsYoy}%</span>
                                    </span>
                                </span>)
                            }else if (ev.type=='forecast'){
                                content = (
                                    <span>
                                        <span>
                                            <span className="c-green">{ev.quarter}季度 预告</span>
                                            <span>{_.includes(ev.ranges,'%')?ev.ranges:(ev.ranges+'%')}</span>
                                        </span>
                                    </span>
                                )
                            }else{
                                content = (<span>
                                            <span>{Dict.eventTypeMapper[ev.type]}</span> 
                                            <span className="event-item-op">
                                                <Icon type="delete" onClick={this.onDeleteEventClick.bind(this,ev.id)} />
                                            </span>
                                        </span>)
                            }


                            return <div className="mt5">
                                <span className="mr5">{ev.eventDate}</span>  
                                {content}
                            </div>
                        })
                    }
                </Card>
            </div>
        );
    }
}