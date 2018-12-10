import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {CONTINUOUS_SPLINE_MINMAX_SEGMENTS_SPECIFIED_URL} from '../../../api/api-config';
import Plot from '../Plot';
import Formula from '../Formula';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import toArr from '../../helpers/toArr';
import truncateCoefs from '../../helpers/truncateCoefs';

import Form from './form';

import {getPlotData/*, getErrorPlot*/, getFuncPlot} from '../MinmaxSpline';
import mock from './mock';

const getErrorPlot = data => {
  const errorsOnEachSegment = data
    .map(segment => toArr(segment.spline).slice(-1)[0].error_plot)
    .filter(errorOnSegment => errorOnSegment.length == 2)

  
  return errorsOnEachSegment.map((segment, index) => {
    return {
      x: segment[0],
      y: segment[1],
      name: `Сегмент ${index + 1}`
    }
  });
};

@inject('loader')
@observer
class ContinuousMinmaxSplineSegmentsSpecified extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      interval: null
    };
    this.calculate = this.calculate.bind(this);
  }

  // notify = () => toast("Wow so easy !");

  calculate({func, deg, start, end, segments}) {
    console.log({func, deg, start, end, segments});
    this.props.loader.showLoader();
    
    setTimeout(() => {
      this.props.loader.hideLoader();

      this.setState({
        data: toArr(mock),
        loaderActive: false,
        // message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
      });

      console.log(getErrorPlot(toArr(mock)))
    }, 0)
    // fetch(CONTINUOUS_SPLINE_MINMAX_SEGMENTS_SPECIFIED_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     func,
    //     deg,
    //     start,
    //     end,
    //     segments
    //   })
    // })
    //   .then(r => r.json())
    //   .then(res => {
    //     this.props.loader.hideLoader();
    //     this.setState({ data: res });

    //   })
    //   .catch(e => {
    //     console.log(e);
    //     this.props.loader.hideLoader();
    //   });
  }

  render() {
    return (
      <div>
        {this.state.interval ? this.state.interval : ''}
        <Form onCalcClick={this.calculate} />
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
              data={getErrorPlot(this.state.data)}
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
                      {segment.max_error.toFixed(5)}
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
                          .slice(-1)[0]
                          .polynom_latex.replace(truncateCoefs(4), '$1')}
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

export default ContinuousMinmaxSplineSegmentsSpecified;