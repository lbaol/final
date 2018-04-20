import { Router, Route, hashHistory,Link  } from 'react-router';
import React from 'react';
import ReactDOM,{ render } from 'react-dom';
import { LocaleProvider  } from 'antd';
import Index from "./index.jsx";
import RecordGroupList from "components/Record/RecordGroupList/index.jsx";
import CloseRecordAnalysis from "components/Record/CloseRecordAnalysis/index.jsx";
import OpenRecordAnalysis from "components/Record/OpenRecordAnalysis/index.jsx";
import PositionList from "components/Position/PositionList/index.jsx";


render((
  <LocaleProvider locale={"zhCN"}>
    <Router history={hashHistory}>
      <Route path="/" component={Index}/>
      <Route path="/position_list" component={PositionList}/>
      <Route path="/record_group_list" component={RecordGroupList}/>
      <Route path="/close_record_analysis" component={CloseRecordAnalysis}/>
      <Route path="/open_record_analysis" component={OpenRecordAnalysis}/>
    </Router>
  </LocaleProvider>
), document.getElementById('container'));