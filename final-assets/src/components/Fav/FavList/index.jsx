import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input,Icon, DatePicker, Tabs, Table,Pagination ,Radio,Modal} from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import { request } from "common/ajax.js";
import { URL, Util,Dict } from "common/config.js";
import FavImport from "components/Fav/FavImport/index.jsx";
import './index.scss';





@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favList: [],
            type:'prepare',
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
                self.setState({
                    favList:res.favList
                })
            }, {
                type:type
            }, 'jsonp')
    }



    onStockItemClick=(code)=>{
        this.emit('final:show-the-stock',{
            code:code
        })
    }

    onFavImportClick=()=>{
        this.emit('final:fav-import-show')
    }


    onTypeChange=(value)=>{
        this.setState({
            type:value
        },this.fatchFavList)
    }

    onDeleteFavByIdClick=(id)=>{
        const self = this;
        request('/fav/deleteById',
        (res)=>{
            self.fatchFavList()
        },{
            id:id
        },'jsonp')
    }

    onDeleteFavByTypeClick=()=>{
        const self = this;
        const {type} = this.state;
        Modal.confirm({
            title: '确定清空该收藏夹吗?',
            content: '',
            onOk() {
                request('/fav/deleteByType',
                    (res)=>{
                        self.fatchFavList()
                    },{
                        type:type
                    },'jsonp')
            },
            onCancel() {},
          })
    }

    render() {
        const {favList, type,typeDS } = this.state;
        const {stockDict} = this.props;
        const pagination = {
            total:favList.length,
            pageSize:100
        }
        return (
            <div>
                <div>
                    <Select style={{width:'100px'}} value={type} size="small"  onChange={this.onTypeChange}>
                        {
                            typeDS.map((d)=>{
                                return <Select.Option value={d.value}>{d.label}</Select.Option>
                            })
                        }
                    </Select>
                    <span className="ml10">
                        <Icon className="c-p" type="plus-circle-o" onClick={this.onFavImportClick} />
                    </span>
                    <span className="ml10">
                        <Icon type="delete" className="c-p" onClick={this.onDeleteFavByTypeClick} />
                    </span>
                    <FavImport/>
                </div>
                <div className="mt10">
                    <Table size="small" className="report-list-table"
                        pagination={pagination}
                        dataSource={favList}
                        scroll={{ x: true, y: 300 }}
                        columns={[{
                            title: '名称',
                            dataIndex: 'name',
                            key:'name',
                            render: (text, record) => {
                                let stock = stockDict[record.code];
                                return (<div>
                                    <span className="c-p" onClick={this.onStockItemClick.bind(this,record.code)}>
                                    {stock && stock.name}
                                    </span>
                                </div>)
                            }
                        },{
                            title: '代码',
                            dataIndex: 'code',
                            key:'code'
                        },
                        {
                            title: '操作',
                            dataIndex: 'action',
                            key:'action',
                            render: (text, record) => {
                                
                                return (<div>
                                    <Icon type="delete" className="c-p" onClick={this.onDeleteFavByIdClick.bind(this,record.id)} />
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