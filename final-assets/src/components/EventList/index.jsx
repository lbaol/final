import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import {  Modal,Select, Icon,Card} from 'antd';
import FEvents from "../FEvent/index.js";
import EventEdit from "../EventEdit/index.jsx";
import { request } from "../../common/ajax.js";
import { URL, Util ,Dict} from "../../common/config.js";
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
           code:'',
           baseInfo:{},
           eventMapper:{}
        };
    }

    componentWillMount(){
        const eventMapper = {};
        for(let e of Dict.eventType){
            eventMapper[e.value] = e.label
        }
        this.setState({
            eventMapper:eventMapper
        })
    }

    componentDidMount() {

        this.on('final:event-edit-finish', (data) => {
            this.emitRefresh(data)
        });

        this.on('final:show-the-stock', (data) => {
            this.emitRefresh(data)
        });

        
    }

    emitRefresh=(data)=>{
        const {code} = this.state;
        this.setState({
            code:data && data.code?data.code:code
        },this.fatchBaseInfo)
    }

    fatchBaseInfo=()=>{
        const self = this;
        const {code} = this.state;
        request('/event/getByCode',
		(res)=>{

            
            let eventList = res.eventList;

            eventList = _.orderBy(eventList, ['eventDate'], ['desc']);
            res.eventList = eventList;

			self.setState({
                baseInfo:res
            })
		},{
            code:code
        },'jsonp')
    }
    
    onAddEventClick=(eventDate)=>{
        const {code} = this.state;
        this.emit('final:event-edit-show',{code:code,eventDate:eventDate?eventDate:''})
    }

    onDeleteEventClick=(id)=>{
        const self = this;
        Modal.confirm({
            title: '确定不是手抖点的删除  ?',
            content: '',
            onOk() {
                request('/event/deleteById',
                    (res)=>{
                        self.fatchBaseInfo()
                    },{
                        id:id
                    },'jsonp')
            },
            onCancel() {},
          })
    }

    render() {
        const {baseInfo,eventMapper} = this.state;
        const baisc = baseInfo.baisc;
        

        return (
            <div className="event-block">
                <Card title="信号" bordered={false}  extra={<Icon className="c-p" onClick={this.onAddEventClick.bind(this,'')} type="plus" />} >
                    {
                        baseInfo.eventList && baseInfo.eventList.map((ev)=>{
                            let content ;
                            if(ev.type=='report'){
                                content = (<span>
                                    <span>
                                        <span className="c-blue">{ev.quarter}季度 报告</span> 
                                        <span>{ev.profitsYoy}%</span>
                                    </span>
                                    <span className="event-item-op">
                                        <Icon className="c-p" onClick={this.onAddEventClick.bind(this,ev.eventDate)} type="plus" />
                                    </span>
                                </span>)
                            }else if (ev.type=='forecast'){
                                content = (
                                    <span>
                                        <span>
                                            <span className="c-green">{ev.quarter}季度 预告</span>
                                            <span>{_.includes(ev.ranges,'%')?ev.ranges:(ev.ranges+'%')}</span>
                                        </span>
                                        <span className="event-item-op">
                                            <Icon className="c-p" onClick={this.onAddEventClick.bind(this,ev.eventDate)} type="plus" />
                                        </span>
                                    </span>
                                )
                            }else{
                                content = (<span>
                                            <span>{eventMapper[ev.type]}</span> 
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
                <EventEdit/>
            </div>
        );
    }
}