import React from 'react';

import ReactHighcharts from 'react-highcharts';
import HighChartsMore from 'highcharts-more';
import HighChartExporting from 'highcharts-exporting';

console.log(HighChartsMore)

HighChartsMore(ReactHighcharts.Highcharts);
HighChartExporting(ReactHighcharts.Highcharts);

const config = (x, y) => ({
  chart: {
    type: 'spline',
    // marginLeft: 100
  },
  title: {
    text: 'Графік функції похибки'
  },
  // subtitle: {
  //   text: 'Source: <a href="https://highcharts.uservoice.com/forums/55896-highcharts-javascript-api">UserVoice</a>'
  // },
  xAxis: {
    type: 'category',
    title: {
      text: null
    },
    min: Math.floor(Math.min(...x)),
    max: Math.floor(Math.max(...x)),
    scrollbar: {
      enabled: true,
      barBorderRadius: 4,
      trackBorderRadius: 4
    },
    tickLength: 0
 },
  yAxis: {
  //  min: 0,
  //  max: 300,
    title: {
      text: 'Похибка',
      align: 'high'
  },
  scrollbar: {
    enabled: true,
    barBorderRadius: 4,
    trackBorderRadius: 4
  },
},
  plotOptions: {
    spline: {
      lineWidth: 4,
      states: {
        hover: {
          lineWidth: 5
        }
      }
    }
 },
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  series: [{
    name: 'x',
    data: x.map((p, i) => [p, y[i]])
  }]
})

export default class HighChartsPlot extends React.Component {
  render () {
    const {x, y} = this.props;
    return (
      <ReactHighcharts config={config(x, y)}></ReactHighcharts>
    )
  }
}
