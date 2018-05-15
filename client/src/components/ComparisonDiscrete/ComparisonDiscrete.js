import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Card, CardText } from 'material-ui/Card';

import FormDiscrete from '../forms/FormDiscrete';
import truncateCoefs from '../../helpers/truncateCoefs';

import Loader from '../loader';
import Plot from '../Plot';
import Formula from '../Formula';

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
}

class ComparisonDiscrete extends Component {
  render() {
    let minmaxData;
    let mmPlot;
    let lsPlot;
    let errsPlot;

    if (this.props.minmaxData) {
      minmaxData = this.props.minmaxData.last();

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
              x: this.props.lssqData.x_approx,
              y: this.props.lssqData.approximation,
              name: 'Апроксимація'
            },
            {
              x: this.props.lssqData.x_vals,
              y: this.props.lssqData.y_vals,
              mode: 'markers',
              name: 'Табл. дані'
            },
            {
              ...this.props.lssqData.max_error_line,
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
              ...this.props.lssqData.error_plot,
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
        <FormDiscrete
          formData={this.props.formData}
          onCalcClick={this.props.clickCalcHandler}
        />
        {this.props.lssqData && (
          <div
            style={{
              width: '90vw',
              position: 'absolute',
              left: '-15vw',
              margin: '30px 0'
            }}
          >
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
                        {this.props.lssqData.max_error.toFixed(4)}
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
                        {this.props.lssqData.x_error.toFixed(4)}
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
                          formula={this.props.lssqData.formula.replace(
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
