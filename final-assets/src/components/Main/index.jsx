import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "../FEvent/index.js";
import SFilter from "../SFilter/index.jsx";
import SChart from "../SChart/index.jsx";
import BaseInfo from "../BaseInfo/index.jsx";
import '../../common/base.scss';
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
           code:'002008'
        };
    }

    componentDidMount() {
        const {code} = this.state;
        this.emit('final:main-chart-refresh',{code:code})
        this.emit('final:base-info-refresh',{code:code})
    }

    

    render() {
        
        return (
            <div className="page-wrap">
                <div className="left-nav">
                    {/* <SFilter /> */}
                </div>
                <div className="main-content">
                    <SChart />
                </div>
                <div  className="right-content">
                    {/* <BaseInfo/> */}
                </div>
            </div>
        );
    }
}