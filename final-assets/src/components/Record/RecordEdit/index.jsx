import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Modal, Form,Row, Col  } from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import { request } from "common/ajax.js";
import { URL, Util, Dict } from "common/config.js";
import './index.scss';

const FormItem = Form.Item;
const { TextArea } = Input;


@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            code: '',
            date: '',
            count: '',
            stopPrice: '',
            subOper: '',
            groupId: '',
            price: '',
            market: '',
            type: '',
            oper: '',
            openId: '',
            openType: '',
            openSignal: '',
            statStatus: '',
            base:'',
            description:'',
            visible: false
        };
    }

    componentDidMount() {
        this.on('final:record-edit-show', (data) => {
            this.setState({
                id: data && data.id ? data.id : '',
                groupId: data && data.groupId ? data.groupId : '',
                code: data && data.code ? data.code : '',
                market: data && data.market ? data.market : '',
                type: data && data.type ? data.type : '',
                date: '',
                count: '',
                stopPrice: '',
                subOper: '',
                price: '',
                oper: '',
                openId: '',
                openType: '',
                openSignal: '',
                statStatus: '',
                base:'',
                description:'',
                visible: true
            }, this.fetchData);
        });
    }

    fetchData = () => {
        let { id } = this.state;
        if (id) {
            request('/record/getById',
                (res) => {
                    if (res) {
                        this.setState({
                            ...res
                        })
                    }
                }, {
                    ...this.state
                }, 'jsonp')
        }

    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onInputChange = (name, e) => {
        this.setState({
            [name]: e.target.value
        })
    }


    onDateFieldChange = (value, valueString) => {
        this.setState({
            date: valueString
        })
    }

    onSelectChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    onSaveClick = () => {
        const self = this;
        request('/record/save',
            (res) => {
                self.setState({ visible: false })
                self.emit('final:record-edit-finish')
            }, {
                ...this.state
            }, 'jsonp')
    }

    render() {
        const { id, code, count, date, price, 
            stopPrice, fee, subOper, market, 
            type, oper, openId, openType, 
            statStatus, openSignal,base,description } = this.state;
        const formItemLayout = {
            labelCol: {
                sm: { span: 6 },
            },
            wrapperCol: {
                sm: { span: 18 },
            },
        };
        return (
            <div >
                <Modal className="record-edit-modal"
                    title={id ? '修改交易记录' : '新增交易记录'}
                    visible={this.state.visible}
                    onOk={this.onSaveClick}
                    onCancel={this.handleCancel}
                    width={900}
                >
                    <Row>
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="类型"
                            >
                                <Select style={{ width: '165px' }} value={type} onChange={this.onSelectChange.bind(this, 'type')}>
                                    {
                                        Dict.recordType.map(e => {
                                            return <Select.Option value={e.value}>{e.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>

                        {
                            type == 'stock' &&
                            <Col span={12}>
                                <FormItem className="required"
                                    {...formItemLayout}
                                    label="市场" >
                                    <Select style={{ width: '165px' }} value={market} onChange={this.onSelectChange.bind(this, 'market')}>
                                        {
                                            Dict.marketType.map(e => {
                                                return <Select.Option value={e.value}>{e.label}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        }
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="代码"
                            >
                                <Input value={code} style={{ width: '165px' }} onChange={this.onInputChange.bind(this, 'code')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="日期"
                            >
                                <DatePicker value={date && moment(date)} style={{ width: '165px' }} onChange={this.onDateFieldChange} placeholder="日期" />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="操作" >
                                <Select style={{ width: '165px' }} value={oper} onChange={this.onSelectChange.bind(this, 'oper')}>
                                    {
                                        Dict.recordOper.map(e => {
                                            return <Select.Option value={e.value}>{e.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        {
                            type == 'futures' &&
                            <Col span={12}>
                                <FormItem className="required"
                                    {...formItemLayout}
                                    label="开平"
                                >
                                    <Select style={{ width: '165px' }} value={subOper} onChange={this.onSelectChange.bind(this, 'subOper')}>
                                        {
                                            Dict.recordSubOper.map(e => {
                                                return <Select.Option value={e.value}>{e.label}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        }
                        {

                            ((type == 'stock' && oper == 'sell') || (type == 'futures' && subOper == 'close')) &&
                            <Col span={12}>
                                <FormItem className="required"
                                    {...formItemLayout}
                                    label="开仓ID/买入ID"
                                >
                                    <Input value={openId} style={{ width: '165px' }} onChange={this.onInputChange.bind(this, 'openId')} />
                                </FormItem>
                            </Col>
                        }
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="数量"
                            >
                                <Input value={count} style={{ width: '165px' }} onChange={this.onInputChange.bind(this, 'count')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="价格"
                            >
                                <Input value={price} style={{ width: '165px' }} onChange={this.onInputChange.bind(this, 'price')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="开仓信号"
                            >
                                <Select style={{ width: '165px' }} value={openSignal} onChange={this.onSelectChange.bind(this, 'openSignal')}>
                                    {
                                        Dict.recordOpenSignal.map(e => {
                                            return <Select.Option value={e.value}>{e.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="开仓点位"
                            >
                                <Select style={{ width: '165px' }} value={openType} onChange={this.onSelectChange.bind(this, 'openType')}>
                                    {
                                        Dict.recordOpenType.map(e => {
                                            return <Select.Option value={e.value}>{e.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem 
                                {...formItemLayout}
                                label="基底(第几个)"
                            >
                                <Input value={base} style={{ width: '165px' }} onChange={this.onInputChange.bind(this, 'base')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="止损价格"
                            >
                                <Input value={stopPrice} style={{ width: '165px' }} onChange={this.onInputChange.bind(this, 'stopPrice')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="手续费"
                            >
                                <Input value={fee} style={{ width: '165px' }} onChange={this.onInputChange.bind(this, 'fee')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem className="required"
                                {...formItemLayout}
                                label="统计状态"
                            >
                                <Select style={{ width: '165px' }} value={statStatus} onChange={this.onSelectChange.bind(this, 'statStatus')}>
                                    {
                                        Dict.recordStatStatus.map(e => {
                                            return <Select.Option value={e.value}>{e.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem 
                                {...formItemLayout}
                                label="描述"
                            >
                                <TextArea  value={description} style={{ width: '330px' }} onChange={this.onInputChange.bind(this, 'description')} />
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

