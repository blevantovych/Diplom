import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableRowColumn } from '@material-ui/core/Table';
import { Card, CardText } from '@material-ui/core/Card';
import { observer, inject } from 'mobx-react';

import FormDiscrete from '../forms/FormDiscrete';
import truncateCoefs from '../../helpers/truncateCoefs';

import Plot from '../Plot';
import Formula from '../Formula';
import {
  MINMAX_DISCRETE_URL,
  LSSQ_DISCRETE_URL
} from '../../../api/api-config';
import toArr from '../../helpers/toArr';

@inject('loader')
@observer
class ComparisonDiscrete extends Component {
  constructor() {
    super();
    this.state = {
      minmax: null,
      lssq: null
    };
    this.clickCalcHandler = this.clickCalcHandler.bind(this);
  }

  clickCalcHandler(xPoints, yPoints, deg) {
    this.props.loader.showLoader();

    const requestData = { x_vals: xPoints, y_vals: yPoints, deg };
    const lssqDiscrete = fetch(LSSQ_DISCRETE_URL, {
      method: 'POST',
      body: JSON.stringify(requestData)
    }).then(r => r.json());

    const minmaxDiscrete = fetch(MINMAX_DISCRETE_URL, {
      method: 'POST',
      body: JSON.stringify(requestData)
    }).then(r => r.json());

    Promise.all([lssqDiscrete, minmaxDiscrete])
      .then(data => {
        // const endTime = Date.now();
        this.props.loader.hideLoader();
        this.setState({
          minmax: toArr(data[1]).slice(-1)[0],
          lssq: data[0]
          // loaderActive: false,
          // message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      })
      .catch(e => {
        console.log(e);
        this.props.loader.hideLoader();
      });
  }

  render() {
    let minmaxData;
    let lssqData;
    let mmPlot;
    let lsPlot;
    let errsPlot;

    if (this.state.minmax && this.state.lssq) {
      minmaxData = this.state.minmax;
      lssqData = this.state.lssq;
      console.log('minmaxData: ', minmaxData);
      mmPlot = (
        <Plot
          id="comp_discrete_mm_plot"
          legend={false}
          plotData={[
            {
              x: minmaxData.x_approx,
              y: minmaxData.approximation,
              name: 'Апроксимація'
            },
            {
              x: minmaxData.x_vals,
              y: minmaxData.y_vals,
              mode: 'markers',
              name: 'Табл. дані'
            },
            {
              x: minmaxData.alternance,
              y: minmaxData.f_alternance,
              mode: 'markers',
              name: 'Точки альтернансу'
            },
            { ...minmaxData.max_error_line, name: 'Максимальна похибка' }
          ]}
        />
      );
      lsPlot = (
        <Plot
          id="comp_discrete_ls_plot"
          legend={false}
          plotData={[
            {
              x: lssqData.x_approx,
              y: lssqData.approximation,
              name: 'Апроксимація'
            },
            {
              x: lssqData.x_vals,
              y: lssqData.y_vals,
              mode: 'markers',
              name: 'Табл. дані'
            },
            {
              ...lssqData.max_error_line,
              name: 'Максимальна похибка',
              line: { color: '#f00' }
            }
          ]}
        />
      );
      errsPlot = (
        <Plot
          id="comp_discrete_errs_plot"
          plotData={[
            {
              ...lssqData.error_plot,
              name: 'МНК'
            },
            {
              x: minmaxData.error_plot[0],
              y: minmaxData.error_plot[1],
              name: 'Мінімакс'
            }
          ]}
        />
      );
    }

    return (
      <div>
        <FormDiscrete onCalcClick={this.clickCalcHandler} />
        {lssqData && (
          <div>
            <Card>
              <CardText>
                <Table>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow>
                      <TableRowColumn width={'20%'} />
                      <TableRowColumn>Мінімакс</TableRowColumn>
                      <TableRowColumn>МНК</TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn width={'20%'}>
                        Макс похибка
                      </TableRowColumn>
                      <TableRowColumn>
                        {minmaxData.max_error.toFixed(4)}
                      </TableRowColumn>
                      <TableRowColumn>
                        {lssqData.max_error.toFixed(4)}
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn width={'20%'}>
                        x в якому макс похибка
                      </TableRowColumn>
                      <TableRowColumn>
                        {minmaxData.x_error.toFixed(4)}
                      </TableRowColumn>
                      <TableRowColumn>
                        {lssqData.x_error.toFixed(4)}
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn width={'20%'}>
                        Аналітичний вигляд
                      </TableRowColumn>
                      <TableRowColumn>
                        <Formula
                          formula={minmaxData.formula.replace(
                            truncateCoefs(4),
                            '$1'
                          )}
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        <Formula
                          formula={lssqData.formula.replace(
                            truncateCoefs(4),
                            '$1'
                          )}
                        />
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn width={'20%'}>Графіки</TableRowColumn>
                      <TableRowColumn>{mmPlot}</TableRowColumn>
                      <TableRowColumn>{lsPlot}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
                {errsPlot}
              </CardText>
            </Card>
          </div>
        )}
      </div>
    );
  }
}

export default ComparisonDiscrete;
