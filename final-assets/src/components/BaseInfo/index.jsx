import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "../FEvent/index.js";
import EventList from "../EventList/index.jsx";
import FavEdit from "../Fav/FavEdit/index.jsx";
import { Icon} from 'antd';
import { request } from "../../common/ajax.js";
import '../../common/base.scss';
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code:'',
            baseInfo:{}
         };
    }

    componentDidMount() {
        this.on('final:show-the-stock', (data) => {
            this.emitRefresh(data)
        });
    }

    emitRefresh=(data)=>{
        const {code} = this.state;
        this.setState({
            code:data && data.code?data.code:code
        },this.fatchBaseInfo)
    }


    fatchBaseInfo=()=>{
        const self = this;
        const {code} = this.state;
        request('/stock/getByCode',
		(res)=>{

			self.setState({
                baseInfo:res
            })
		},{
            code:code
        },'jsonp')
    }

    onFavClick=()=>{
        const {code} = this.state;
        this.emit('final:fav-edit-show',{
            code:code
        })
    }

    

    render() {

        const {baseInfo} = this.state;
        const basic = baseInfo.basic;
        
        return (
            <div className="base-info">
                <div>
                    {basic && basic.code} {basic && basic.name}  
                    <span className="ml10">
                        <Icon className="c-p" type="heart-o" onClick={this.onFavClick} />
                    </span> 
                </div>
                <EventList/>
                <FavEdit/>
            </div>
        );
    }
}