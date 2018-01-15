import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FEvents from "components/Common/FEvent/index.js";
import AlertList from "components/Alert/AlertList/index.jsx";
import NoteEdit from "components/Note/NoteEdit/index.jsx";
import DataSetting from "components/Data/Setting/index.jsx";
import IndexPeriodManage from "components/IndexPeriod/Manage/index.jsx";
import {Env} from "common/config.js";
import { request } from "common/ajax.js";
import { LocaleProvider ,Icon } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'common/base.scss';



@FEvents
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        
    }


    onEditOverallNoteClick=()=>{
        this.emit('final:note-overall-edit-show')
    }

    onDataSettingClick=()=>{
        const {code} = this.state;
        this.emit('final:data-setting-show')
    }
    
    

    render() {
        
        return (
            <LocaleProvider locale={zhCN}>
                <div className={"page-wrap "+"page-wrap-"+Env}>
                    <span className="ml10">
                        <Icon className="c-p" type="file-text" onClick={this.onEditOverallNoteClick} />
                    </span>
                    <span className="ml10">
                        <Icon className="c-p" type="setting" onClick={this.onDataSettingClick} />
                    </span>
                    <DataSetting/>
                    <NoteEdit/>
                    <div className="mt20">
                        <IndexPeriodManage/>
                    </div>
                </div>
            </LocaleProvider>
            
        );
    }
}