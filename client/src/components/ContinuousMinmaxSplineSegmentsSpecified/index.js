import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {CONTINUOUS_SPLINE_MINMAX_SEGMENTS_SPECIFIED_URL} from '../../../api/api-config';
import Plot from '../Plot';
import Formula from '../Formula';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import toArr from '../../helpers/toArr';
import truncateCoefs from '../../helpers/truncateCoefs';

import Form from './form';

import {getPlotData, getErrorPlot, getFuncPlot} from '../MinmaxSpline';

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
    //
    fetch(CONTINUOUS_SPLINE_MINMAX_SEGMENTS_SPECIFIED_URL, {
      method: 'POST',
      body: JSON.stringify({
        func,
        deg,
        start,
        end,
        segments
      })
    })
      .then(r => r.json())
      .then(res => {
        this.props.loader.hideLoader();
        this.setState({ data: res });

      })
      .catch(e => {
        console.log(e);
        this.props.loader.hideLoader();
      });
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
      </div>
    );
  }
}

export default ContinuousMinmaxSplineSegmentsSpecified;