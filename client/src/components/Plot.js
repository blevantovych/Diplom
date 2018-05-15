import React, { Component } from 'react';

class Plot extends Component {
  constructor(props) {
    super(props);
  }

  renderPlot = () => {
    const leftPoint = Math.min(...this.props.plotData.map(p => p.x[0]));
    const rightPoint = Math.max(
      ...this.props.plotData.map(p => p.x[p.x.length - 1])
    );
    const add = (rightPoint - leftPoint) / 40;
    const xRange = { range: [leftPoint - add, rightPoint + add] };
    // const yRange = this.props.yRange || null
    const yRange = this.props.yRange || null;
    if (this.props.legend === false) {
      Plotly.newPlot('plot' + this.props.id, this.props.plotData, {
        title: this.props.title,
        showlegend: false,
        xaxis: xRange,
        yaxis: { range: yRange }
        // yaxis: {range: [-0.0004, 0.0004]}
      });
    } else {
      Plotly.newPlot('plot' + this.props.id, this.props.plotData, {
        title: this.props.title,
        xaxis: xRange,
        yaxis: { range: yRange }
        // yaxis: {range: [-0.0004, 0.0004]}
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    this.renderPlot();
  }

  componentDidMount() {
    this.renderPlot();
  }

  render() {
    return <div id={'plot' + this.props.id} />;
  }
}

export default Plot;
