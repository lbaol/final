import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "components/Common/FEvent/index.js";
import { Icon} from 'antd';
import { request } from "common/ajax.js";
import { Dict,Util } from "common/config.js";
import 'common/base.scss';
import './index.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code:props.code,
            baseInfo:{},
            selectedFav:[]
         };
    }

    componentDidMount() {
        

        this.fatchBaseInfo()
    }

    componentWillReceiveProps(nextProps) {
        
        if (nextProps.hasOwnProperty('code') && !_.isEqual(this.state.code, nextProps.code)) {
            this.setState({
                code: nextProps.code
            }, this.fatchBaseInfo)
        }
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

        request('/fav/getByParam',
		(res)=>{
            let selected = [];
            if(res.favList){
                self.setState({
                    selectedFav:res.favList
                })
            }
            
		},{
            code:code
        },'jsonp')
    }

    onAddFavClick=()=>{
        const {code} = this.state;
        this.emit('final:fav-edit-show',{
            code:code
        })
    }

    onEditDefaultNoteClick=()=>{
        const {code} = this.state;
        this.emit('final:note-default-edit-show',{
            code:code
        })
    }

    onRefreshStockChart=()=>{
        const {code} = this.state;
        this.emit('final:stock-chart-refresh',{
            code:code
        })
    }


    

    render() {

        const {baseInfo,selectedFav} = this.state;
        const basic = baseInfo.basic || {};
        
        return (
            <div className="base-info">
                <div>
                    {basic && basic.code} {basic && basic.name}  
                    
                    <span className="ml10">
                        <Icon className="c-p" type="heart-o" onClick={this.onAddFavClick} />
                    </span> 
                    <span className="ml10">
                        <Icon className="c-p" type="file-text" onClick={this.onEditDefaultNoteClick} />
                    </span> 
                    <span className="ml10">
                        <Icon className="c-p" type="sync" onClick={this.onRefreshStockChart} />
                    </span> 
                    <span className="ml10">
                        {Util.getXueQiuStockLink(basic.code)}
                    </span>
                    <span className="ml5">
                        {Util.getDongCaiStockLink(basic.code)}
                    </span>
                    <span  className="ml20">
                    {
                        selectedFav && selectedFav.map((d)=>{
                            return <span className="mr10">{Dict.favTypeMapper[d.type]}</span>
                        })
                    }
                    </span>
                </div>
                
                
                
            </div>
        );
    }
}