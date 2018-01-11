import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "components/Common/FEvent/index.js";
import { Icon,Button} from 'antd';
import 'common/base.scss';
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible:false
         };
    }

    componentDidMount() {
        
    }



    
    onSliderButtonClick=()=>{
        this.setState({
            visible:!this.state.visible
        })
    }

    

    render() {
        const {visible} = this.state;
         
        
        return (
            <div className={'slider-right '+(visible==true?'show':'')}>
                <span className="slider-right-close">
                    <Button onClick={this.onSliderButtonClick} type="primary">{visible==true?'>':'<'}</Button>
                </span>
                {this.props.children}
            </div>
        );
    }
}