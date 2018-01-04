import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "components/Common/FEvent/index.js";
import EventList from "components/Event/EventList/index.jsx";
import FavEdit from "components/Fav/FavEdit/index.jsx";
import NoteEdit from "components/Note/NoteEdit/index.jsx";
import DataSetting from "components/Data/Setting/index.jsx";
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
            code:'',
            baseInfo:{},
            selectedFav:[]
         };
    }

    componentDidMount() {
        

        this.on('final:base-info-refresh', (data) => {
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

    onEditOverallNoteClick=()=>{
        this.emit('final:note-overall-edit-show')
    }


    onDataSettingClick=()=>{
        const {code} = this.state;
        this.emit('final:data-setting-show')
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
                        {Util.getXueQiuStockLink(basic.code)}
                    </span>
                    <span className="ml5">
                        {Util.getDongCaiStockLink(basic.code)}
                    </span>
                    <div className="f-r">
                        <span className="ml10">
                            <Icon className="c-p" type="file-text" onClick={this.onEditOverallNoteClick} />
                        </span>
                        <span className="ml10">
                            <Icon className="c-p" type="setting" onClick={this.onDataSettingClick} />
                        </span>
                    </div>
                     
                </div>
                <div>
                    {
                        selectedFav && selectedFav.map((d)=>{
                            return <span className="mr10">{Dict.favTypeMapper[d.type]}</span>
                        })
                    }
                </div>
                <EventList/>
                <FavEdit/>
                <NoteEdit/>
                <DataSetting/>
            </div>
        );
    }
}