import React, { Component } from 'react';
import { action } from 'mobx';
import { inject } from 'mobx-react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

import { SPLINE_MINMAX_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';
import SplineForm from './spline-form';
import PropTypes from 'prop-types';
import Plot from '../Plot';
import Formula from '../Formula';
import truncateCoefs from '../../helpers/truncateCoefs';

export const getPlotData = (segment, index) => {
  const iterations = toArr(segment.spline);
  const lastIteration = iterations.last();
  const trace = {
    x: lastIteration.pol_plot[0],
    y: lastIteration.pol_plot[1],
    name: `Сегмент ${index + 1}`
  };
  return trace;
};

export const getErrorPlot = data => {
  let x = [];
  let y = [];
  data.forEach(segment => {
    const error_plot_on_segment = toArr(segment.spline).last().error_plot;
    x = [...x, ...error_plot_on_segment[0].slice(1, -1)];
    y = [...y, ...error_plot_on_segment[1].slice(1, -1)];
  });
  return {
    x,
    y
  };
};

export const getFuncPlot = data => {
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
        start: +start,
        end: +end,
        deg: +deg,
        precision: +precision,
        allowed_error: +allowed_error
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
        {this.state.data
          ? [
              <Plot
                key="plot"
                id="approx_plot"
                title="Апроксимація мінімаксними сплайнами"
                plotData={[
                  ...this.state.data.map(getPlotData),
                  getFuncPlot(this.state.data)
                ]}
              />,
              <Plot
                key="error_plot"
                id="error_plot"
                title="Графік функції похибки"
                plotData={[getErrorPlot(this.state.data)]}
              />,
              <Table
                key="table"
                fixedHeader={false}
                style={{ width: 'auto', tableLayout: 'auto' }}
              >
                <TableBody displayRowCheckbox={false}>
                  <TableRow>
                    <TableRowColumn>Сегмент</TableRowColumn>
                    <TableRowColumn>Максимальна похибка</TableRowColumn>
                    <TableRowColumn>Інтервал</TableRowColumn>
                    <TableRowColumn>Аналітичний вигляд</TableRowColumn>
                  </TableRow>
                  {this.state.data.map((segment, index) => (
                    <TableRow key={index}>
                      <TableRowColumn>{index + 1}</TableRowColumn>
                      <TableRowColumn>
                        {segment.max_error.toFixed(3)}
                      </TableRowColumn>
                      <TableRowColumn>
                        <Formula
                          formula={`[${segment.interval[0].toFixed(3)};
                            ${segment.interval[1].toFixed(3)}]`}
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        <Formula
                          formula={toArr(segment.spline)
                            .last()
                            .polynom_latex.replace(truncateCoefs(4), '$1')}
                        />
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ]
          : null}
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
