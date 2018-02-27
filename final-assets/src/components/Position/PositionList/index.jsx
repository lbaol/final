import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import StockPosition from "components/Position/StockPosition/index.jsx";
import RecordGroupEdit from "components/Record/RecordGroupEdit/index.jsx";
import RecordEdit from "components/Record/RecordEdit/index.jsx";
import QuoteSwitch from "components/Common/QuoteSwitch/index.jsx";




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
                <StockPosition market="a" type="stock"/>
                <StockPosition market="" type="futures"/>
                <RecordGroupEdit />
                <RecordEdit />
            </div>
            
        );
    }
}