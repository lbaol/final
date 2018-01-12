import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Button, Select, Input, DatePicker, Tabs, Table,Pagination ,Radio} from 'antd';
import FEvents from "components/Common/FEvent/index.js";

import { URL, Util } from "common/config.js";
import ReportList from "components/Event/ReportList/index.jsx";
import FavList from "components/Fav/FavList/index.jsx";
import EventList from "components/Event/EventList/index.jsx";



const TabPane = Tabs.TabPane;



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

   

    render() {
        const { code, period } = this.state;
        
        return (

            <div className="s-filter">
                <Tabs onChange={this.onTabChange} type="card" size="small">
                    <TabPane tab="收藏"  key="fav-list">
                        <FavList stockDict={this.props.stockDict}/>
                    </TabPane>
                    <TabPane tab="业绩"  key="report-list">
                        <ReportList  stockDict={this.props.stockDict}/>
                    </TabPane>
                    
                </Tabs>

            </div>
        );
    }
}