import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import {  Checkbox,Modal} from 'antd';
import FEvents from "components/Common/FEvent/index.js";
import { request } from "common/ajax.js";
import { URL, Util,Dict } from "common/config.js";



@FEvents
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            code:'',
            visible: false,
            value:[],
            favOptions:Dict.favType,
            defaultValue:['']
        };
    }

    componentDidMount() {
        const {code,type} = this.state;
        this.on('final:fav-edit-show', (data) => {
            this.setState({
                code:data && data.code
            },this.fatchSelectedByCode);
            
        });
    }

    fatchSelectedByCode=()=>{
        const {code} = this.state;
        const self = this;
        request('/fav/getByParam',
		(res)=>{
            let selected = [];
            if(res.favList){
                selected = _.map(res.favList,'type')
            }
            self.setState({
                visible:true,
                value:selected
            })
		},{
            code:code
        },'jsonp')
    }
    
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onFavSelectChange=(value)=>{
        this.setState({
            value:value
        })
    }

   

    onSaveClick=()=>{
        const self = this;
        const {code,value} = this.state;
        request('/fav/updateByCodeAndTypes',
		(res)=>{
            self.setState({visible:false})
            self.emit('final:fav-edit-finish')
		},{
            code:code,
            types:value
        },'jsonp')
    }

    render() {
        const {type,favOptions,defaultValue,value} = this.state;
        return (
            <div>
                <Modal
                    title="收藏"
                    visible={this.state.visible}
                    onOk={this.onSaveClick}
                    onCancel={this.handleCancel}
                >
                    <Checkbox.Group options={favOptions} defaultValue={defaultValue} value={value} onChange={this.onFavSelectChange} />
                </Modal>
            </div>
        );
    }
}

