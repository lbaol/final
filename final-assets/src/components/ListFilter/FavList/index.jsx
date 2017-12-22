import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input,Icon, DatePicker, Tabs, Table,Pagination ,Radio,Modal} from 'antd';
import FEvents from "../../FEvent/index.js";
import { request } from "../../../common/ajax.js";
import { URL, Util,Dict } from "../../../common/config.js";
import FavImport from "../../Fav/FavImport/index.jsx";
import './index.scss';


const TabPane = Tabs.TabPane;


let _eventList = {
    allList : [],
    increaseList : [],
    otherList : []
}

let _allStocksMap = [];

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favList: [],
            type:'default',
            typeDS:Dict.favTypeDict
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


    onTypeChange=(e)=>{
        this.setState({
            type:e.target.value
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
            title: '确定不是手抖点的清空收藏夹?',
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
                    <Radio.Group  onChange={this.onTypeChange} value={type} size="small">
                        {
                            typeDS.map((t)=>{
                                return <Radio.Button value={t.value}>{t.label}</Radio.Button>
                            })
                        }
                    </Radio.Group>
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
                                </div>)
                            }
                        }
                        ]}  />
                </div>
                        

            </div>
        );
    }
}