import React from 'react';
import { render } from 'react-dom';
import StockChart from "../../components/StockChart/index.jsx";
import './index.scss';

render(<div className="hw">
        <StockChart />
    </div>, 
    document.getElementById('root')
);
