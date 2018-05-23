import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
// import IterationList from '../iteration-lists/IterationList';
// import Form from '../forms/Form';
import { SPLINE_MINMAX_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';
import SplineForm from './spline-form';
import PropTypes from 'prop-types';
import Plot from '../Plot';

const getPlotData = (segment, index) => {
  const iterations = toArr(segment.spline);
  const lastIteration = iterations.last();
  const trace = {
    x: lastIteration.pol_plot[0],
    y: lastIteration.pol_plot[1],
    name: `Сегмент ${index + 1}`
  };
  return trace;
};

const getFuncPlot = data => {
  console.log('%c data', 'font-size: 20px');
  console.log(data);
  const funcDataOnAllInterval = [[], []];
  data.forEach(segment => {
    const funcPlotOnSegment = toArr(segment.spline).last().func_plot;
    funcDataOnAllInterval[0] = [
      ...funcDataOnAllInterval[0],
      ...funcPlotOnSegment[0]
    ];
    funcDataOnAllInterval[1] = [
      ...funcDataOnAllInterval[1],
      ...funcPlotOnSegment[1]
    ];
  });
  return {
    x: funcDataOnAllInterval[0],
    y: funcDataOnAllInterval[1],
    name: 'Графік функції'
  };
};

@inject('loader')
class Minmax extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.calculateMinmax = this.calculateMinmax.bind(this);
  }

  calculateMinmax(func, deg, start, end, precision, allowed_error) {
    // const startTime = Date.now();
    this.props.loader.showLoader();
    fetch(SPLINE_MINMAX_URL, {
      method: 'POST',
      body: JSON.stringify({
        func,
        start,
        end,
        deg,
        precision,
        allowed_error
      })
    })
      .then(r => r.json())
      .then(
        action(r => {
          this.props.loader.hideLoader();
          this.setState({ data: r });
          console.log(r);
          // const endTime = Date.now();
          // this.data = toArr(r);
          // this.setState({
          //   data: toArr(r),
          //   loaderActive: false,
          //   message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
          // });
        })
      )
      .catch(e => {
        console.error(`Something went wrong!\n ${e}`);
        this.props.loader.hideLoader();
      });
  }

  render() {
    return (
      <div style={{ width: '100%', margin: '0 auto' }}>
        <SplineForm onCalcClick={this.calculateMinmax} />
        {this.state.data ? (
          <Plot
            plotData={[
              ...this.state.data.map(getPlotData),
              getFuncPlot(this.state.data)
            ]}
          />
        ) : null}
        {/* {this.data ? <IterationList arr={toJS(this.data)} /> : null} */}
      </div>
    );
  }
}

Minmax.propTypes = {
  loader: PropTypes.shape({
    hideLoader: PropTypes.func,
    showLoader: PropTypes.func
  })
};

export default Minmax;
