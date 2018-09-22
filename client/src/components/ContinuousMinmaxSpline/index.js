import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Plot from '../Plot';
import Formula from '../Formula';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import toArr from '../../helpers/toArr';
import truncateCoefs from '../../helpers/truncateCoefs';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import FormDiscrete from '../forms/FormDiscrete';
// import IterationListDiscreteMinmax from '../iteration-lists/IterationListDiscreteMinmax';
import { CONTINUOUS_SPLINE_MINMAX_URL } from '../../../api/api-config';
// import toArr from '../../helpers/toArr';
import ContinuousSplineMinmaxForm from './form';

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

const getErrorPlot = data => {
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

const getFuncPlot = data => {
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
@observer
class ContinuousMinmaxSpline extends Component {
  constructor() {
    super();
    this.state = {
      data: null
    };
    this.calculate = this.calculate.bind(this);
  }

  // notify = () => toast("Wow so easy !");

  calculate(func, deg, start, end, precision, allowed_error) {
    this.props.loader.showLoader();
    console.log({ func, deg, start, end, precision, allowed_error });

    fetch(CONTINUOUS_SPLINE_MINMAX_URL, {
      method: 'POST',
      body: JSON.stringify({
        func,
        deg,
        start,
        end,
        precision,
        allowed_error
      })
    })
      .then(r => r.json())
      .then(res => {
        this.props.loader.hideLoader();
        this.setState({ data: res });

        console.log(res);
        // const endTime = Date.now();

        // this.setState({
        //   data: toArr(res)
        //   // message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        // });
      })
      .catch(e => {
        console.log(e);
        this.props.loader.hideLoader();
      });
  }
  render() {
    return (
      <div>
        <ContinuousSplineMinmaxForm onCalcClick={this.calculate} />
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
        {/* <FormDiscrete onCalcClick={this.clickCalcHandler} />
        {this.state.data ? (
          <IterationListDiscreteMinmax arr={this.state.data} />
        ) : null} */}
      </div>
    );
  }
}

export default ContinuousMinmaxSpline;