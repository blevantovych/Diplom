import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FormDiscrete from '../forms/FormDiscrete';
import Plot from '../Plot';
import Formula from '../Formula'
import { TextField } from '@material-ui/core'
import { Table, TableBody, TableRow, TableRowColumn } from '@material-ui/core/Table';
import { MINMAX_SPLINE_DISCRETE_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import truncateCoefs from '../../helpers/truncateCoefs';

export const getPlotData = (segment, index) => {
  const iterations = toArr(segment.spline);
  const lastIteration = iterations.slice(-1)[0];
  const trace = {
    x: lastIteration.x_approx,
    y: lastIteration.approximation,
    name: `Сегмент ${index + 1}`
  };
  return trace;
};

export const getErrorPlot = data => {
  let x = [];
  let y = [];
  data.forEach(segment => {
    const error_plot = toArr(segment.spline).slice(-1)[0].error_plot;
    x = [...x, ...error_plot[0].slice(1, -1)];
    y = [...y, ...error_plot[1].slice(1, -1)];
  });
  return {
    x,
    y
  };
};

export const getFuncPlot = data => {
  const funcDataOnAllInterval = [[], []];
  data.forEach(segment => {
    const iteration = toArr(segment.spline).slice(-1)[0];
    funcDataOnAllInterval[0] = [...funcDataOnAllInterval[0], ...iteration.x_vals]
    funcDataOnAllInterval[1] = [...funcDataOnAllInterval[1], ...iteration.y_vals]

    // const funcPlotOnSegment = [
    //   iteration.approximation,
    //   iteration.x_approx
    // ]
    // funcDataOnAllInterval[0] = [
    //   ...funcDataOnAllInterval[0],
    //   ...funcPlotOnSegment[0]
    // ];
    // funcDataOnAllInterval[1] = [
    //   ...funcDataOnAllInterval[1],
    //   ...funcPlotOnSegment[1]
    // ];
  });
  return {
    x: funcDataOnAllInterval[0],
    y: funcDataOnAllInterval[1],
    name: 'Графік функції'
  };
};

const getInterval = (x_vals, segment) => {
  console.log()
  const interval = segment.interval;
  const left_point = x_vals[interval[0]]
  const right_point = x_vals[interval[1]]
  // debugger;
  return `[${left_point.toFixed(3)};
        ${right_point.toFixed(3)}]`
}
  

const demo = false;

@inject('loader')
@observer
class SplineMinmaxDiscrete extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      allowed_error: 0.5,
      xPoints: []
    };
    this.clickCalcHandler = this.clickCalcHandler.bind(this);
  }
  clickCalcHandler(xPoints, yPoints, deg, pinnedPoints) {
    this.props.loader.showLoader();
    this.setState({
      xPoints
    })

    fetch(MINMAX_SPLINE_DISCRETE_URL, {
      method: 'POST',
      body: JSON.stringify({
        x_vals: xPoints,
        y_vals: yPoints,
        deg,
        allowed_error: +this.state.allowed_error,
        pinnedPoints: pinnedPoints.map(point => +point)
      })
    }).then(res => res.json()).then(res => {
        this.props.loader.hideLoader();
        // const endTime = Date.now();

        this.setState({
          data: toArr(res)
          // message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      })
      .catch(({status, errPromise}) => {
        errPromise.then(err => {
          toast(err.message);
          this.props.loader.hideLoader();
        })
      });
  }
  render() {
    return (
      <div>
        <ToastContainer hideProgressBar={true} />
        {
          demo
            ? !this.state.data ? <FormDiscrete onCalcClick={this.clickCalcHandler} pinPoints={true} /> : null
            : (
              <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <TextField
                    floatingLabelText="Допустима похибка"
                    type="number"
                    value={this.state.allowed_error || ''}
                    onChange={e => this.setState({ allowed_error: e.target.value })}
                  />
                <FormDiscrete onCalcClick={this.clickCalcHandler} pinPoints={true} />
              </div>
            )
        }
        {this.state.data
          ? [
              <Plot
                key="plot"
                layout={{title: "Апроксимація мінімаксними сплайнами"}}
                data={[
                  ...this.state.data.map(getPlotData),
                  getFuncPlot(this.state.data)
                ]}
              />,
              <Plot
                key="error_plot"
                layout={{title: "Графік функції похибки"}}
                data={[getErrorPlot(this.state.data)]}
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
                          formula={getInterval(this.state.xPoints, segment)}
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        <Formula
                          formula={toArr(segment.spline)
                            .slice(-1)[0]
                            .formula.replace(truncateCoefs(4), '$1')}
                        />
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ]
          : null}
      </div>
    );
  }
}

export default SplineMinmaxDiscrete;
