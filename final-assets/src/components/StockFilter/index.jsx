import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Tabs, Table,Pagination ,Radio} from 'antd';
import FEvents from "../FEvent/index.js";
import ListFilter from "../ListFilter/index.jsx";

import { request } from "../../common/ajax.js";
import { URL, Util } from "../../common/config.js";
import './index.scss';


const TabPane = Tabs.TabPane;


let _allStocksMap = [];

@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            period: 'day',
            startDate: '',
        };
    }

    componentDidMount() {
       
    }

   
   
    onFieldChange = (name, value) => {
        this.fieldChange(name, value);
    }

    onInputFieldChange = (name) => {
        let value = ReactDOM.findDOMNode(this.refs['s-filter-' + name]).value;
        this.fieldChange(name, value);
    }

    onDateFieldChange = (name, value, valueString) => {
        this.fieldChange(name, valueString);
    }

    onSearchClick = () => {
        this.emit('chart:refresh', this.state)
    }

    onStockItemClick=(code)=>{
        this.emit('final:show-the-stock',{
            ...this.state,
            code:code
        })
    }

    fieldChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    render() {
        const { code, period } = this.state;
        
        return (

            <div className="s-filter">
                <Tabs onChange={this.onTabChange} type="card" size="small">
                    <TabPane tab="报表预告"  key="report-list">
                        <ListFilter/>
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}