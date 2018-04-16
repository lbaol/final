import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Position from "components/Position/Position/index.jsx";
import RecordGroupEdit from "components/Record/RecordGroupEdit/index.jsx";
import RecordEdit from "components/Record/RecordEdit/index.jsx";
import QuoteSwitch from "components/Common/QuoteSwitch/index.jsx";
import { Config } from "common/config.js";




export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    componentDidMount() {
        
    }

    
    

    render() {

      
        
        return (
            <div>
                <div className="ml20 mt20">
                    <QuoteSwitch/>
                </div>
                <Position market="a" type="stock" cash={Config.cash.stock}/>
                <Position market="" type="futures" cash={Config.cash.futures} />
                <RecordGroupEdit />
                <RecordEdit />
            </div>
            
        );
    }
}