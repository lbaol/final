import React from 'react';
import ReactDOM,{ render } from 'react-dom';
import SFilter from "../../components/SFilter/index.jsx";
import SChart from "../../components/SChart/index2.jsx";
import '../../common/base.scss';
import './index.scss';

render(<div className="page-wrap">
            <div className="left-nav">
                {/* <SFilter /> */}
            </div>
            <div className="main-content">
                <SChart />
            </div>
        
    </div>, 
    document.getElementById('root')
);
