import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch} from 'antd';
import 'common/base.scss';
import { Config} from "common/config.js";




export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked:Config.quote.doInterval
        };
    }

    componentDidMount() {
        
    }



    
    onChange=(checked)=>{
        Config.quote.doInterval = checked;
        this.setState({checked})
    }
    

    render() {
        
         
        
        return (
            <span style={{fontSize:'12px'}}>
                <span style={{verticalAlign:'middle'}}>行情获取开关：</span>
                <Switch size="small" checkedChildren="开" unCheckedChildren="关" checked={this.state.checked} onChange={this.onChange} />
            </span>
        );
    }
}