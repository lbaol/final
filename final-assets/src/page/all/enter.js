import { Router, Route, hashHistory,Link  } from 'react-router';
import React from 'react';
import ReactDOM,{ render } from 'react-dom';
import { LocaleProvider  } from 'antd';
import Index from "./index.jsx";
import RecordList from "components/Record/RecordList/index.jsx";


render((
  <LocaleProvider locale={"zhCN"}>
    <Router history={hashHistory}>
      <Route path="/" component={Index}/>
      <Route path="/record_list" component={RecordList}/>
    </Router>
  </LocaleProvider>
), document.getElementById('container'));