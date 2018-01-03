import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select,Icon, Input,Checkbox, DatePicker, Tabs, Table, Pagination, Radio, Form } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import { request } from "common/ajax.js";
import { URL, Util,Config } from "common/config.js";


const _defaultDayMa = Config.defalutMas.day;
const _defaultWeekMa = Config.defalutMas.week;


@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '002008',
            period: 'day',
            startDate: '',
            endDate:'',
            maOptions:[
                { label: '10', value: 10 },
                { label: '20', value: 20 },
                { label: '30', value: 30 },
                { label: '50', value: 50 },
                { label: '120', value: 120 },
                { label: '250', value: 250 }
              ],
            mas:[]
        };
    }

    componentWillMount() {
        let { period } = this.state;
        let m = period == 'day' ? Config.defaultPeriod.day : Config.defaultPeriod.week;
        this.setState({
            startDate: moment().subtract(m, 'day').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            mas: period=='day'?_defaultDayMa:_defaultWeekMa            
        })
    }

    componentDidMount() {

        this.on('final:detail-init', (data) => {
            this.refreshAllComponent();
        });

        this.on('final:show-the-stock', (data) => {
            this.setState({
                code:data && data.code
            },this.refreshAllComponent)
        });
    }



    onFieldEventChange = (name, e) => {
        this.fieldChange(name, e.target.value);
    }

    onPeriodChange=(e)=>{
        let value = e.target.value;
        let m = (value == 'day' ? Config.defaultPeriod.day : Config.defaultPeriod.week);
        this.setState({
            startDate: moment().subtract(m, 'day').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            period:value,
            mas:(value=='day'?_defaultDayMa:_defaultWeekMa)
        },this.refreshAllComponent)
    }


    onFieldValueChange = (name,value) => {
        this.fieldChange(name, value);
    }

    onDateFieldChange = (name, value, valueString) => {
        this.fieldChange(name, valueString);
    }

    onSearchClick = () => {
        this.refreshAllComponent();
    }

    refreshAllComponent = () => {
        let data = this.state;
        this.emit('final:base-info-refresh', data);
        this.emit('final:stock-chart-refresh', data);
        this.emit('final:event-list-refresh', data);
    }


    fieldChange = (name, value) => {
        this.setState({
            [name]: value
        }, () => {
            if (name == 'code' && _.toString(value).length != 6) {
                return;
            }
            this.refreshAllComponent()
        })
    }

    render() {
        const { code, period,startDate,endDate,maOptions,mas } = this.state;

        return (

            <div>
                <Form layout="inline">
                    <div>
                        <Form.Item>
                            <Input style={{ width: '100px' }} value={code} size="small" onChange={this.onFieldEventChange.bind(this, 'code')} placeholder="代码" />
                        </Form.Item>
                        <Form.Item>
                            <Radio.Group size="small" onChange={this.onPeriodChange} value={period} >
                                <Radio.Button value="day">日</Radio.Button>
                                <Radio.Button value="week">周</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <DatePicker value={moment(startDate)} size="small" onChange={this.onDateFieldChange.bind(this, 'startDate')} placeholder="开始时间" />
                        </Form.Item>
                        <Form.Item>
                            <DatePicker  value={moment(endDate)} size="small" onChange={this.onDateFieldChange.bind(this, 'endDate')} placeholder="结束时间" />
                        </Form.Item>
                        <Form.Item>
                                <Icon type="search" onClick={this.onSearchClick} />
                            
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item>
                            <Checkbox.Group options={maOptions} value={mas} onChange={this.onFieldValueChange.bind(this,'mas')} />
                        </Form.Item>
                    </div>
                    
                    
                </Form>
            </div>
        );
    }
}