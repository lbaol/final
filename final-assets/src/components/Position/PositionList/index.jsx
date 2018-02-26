import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import StockPosition from "components/Position/StockPosition/index.jsx";




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
                <StockPosition market="a" type="stock"/>
            </div>
            
        );
    }
}