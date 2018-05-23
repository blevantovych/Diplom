import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Plot extends Component {
  renderPlot = () => {
    const leftPoint = Math.min(...this.props.plotData.map(p => p.x[0]));
    const rightPoint = Math.max(
      ...this.props.plotData.map(p => p.x[p.x.length - 1])
    );
    const margin = (rightPoint - leftPoint) / 40;
    const xRange = { range: [leftPoint - margin, rightPoint + margin] };

    const yRange = this.props.yRange || null;

    const plotOptions = {
      title: this.props.title,
      // showlegend: this.props.legend,
      xaxis: xRange,
      yaxis: { range: yRange }
    };

    Plotly.newPlot('plot' + this.props.id, this.props.plotData, plotOptions);
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

Plot.propTypes = {
  plotData: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.arrayOf(PropTypes.number),
      y: PropTypes.arrayOf(PropTypes.number),
      mode: PropTypes.string,
      name: PropTypes.string
    })
  ),
  title: PropTypes.string,
  id: PropTypes.string,
  yRange: PropTypes.arrayOf(PropTypes.number),
  legend: PropTypes.bool
};

export default Plot;
