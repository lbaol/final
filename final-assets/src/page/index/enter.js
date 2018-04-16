import { Router, Route, hashHistory,Link  } from 'react-router';
import React from 'react';
import ReactDOM,{ render } from 'react-dom';
import { LocaleProvider  } from 'antd';
import Index from "./index.jsx";
import RecordGroupList from "components/Record/RecordGroupList/index.jsx";
import RecordAnalysis from "components/Record/RecordAnalysis/index.jsx";
import PositionList from "components/Position/PositionList/index.jsx";


render((
  <LocaleProvider locale={"zhCN"}>
    <Router history={hashHistory}>
      <Route path="/" component={Index}/>
      <Route path="/position_list" component={PositionList}/>
      <Route path="/record_group_list" component={RecordGroupList}/>
      <Route path="/record_analysis" component={RecordAnalysis}/>
    </Router>
  </LocaleProvider>
), document.getElementById('container'));