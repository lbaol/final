'use strict';

import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
        
        };
    }

    ready(chart) {
        chart.on('click', ()=>{
            alert('click');
        });
    }

    
    render() {
        
        const options = {
            legend: {
              data: ['最高气温', '最低气温'],
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            }],
            yAxis: [{
              type: 'value',
              axisLabel: {
                formatter: '{value} °C'
              }
            }],
          };
          return (
            <ReactEcharts
              option={options}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"}
              onChartReady={this.onChartReadyCallback}
              onEvents={EventsDict} />
          );
  }
}