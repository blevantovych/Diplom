import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import range from 'lodash.range';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Card, CardText } from 'material-ui/Card';

import Form from '../forms/Form';
import truncateCoefs from '../../helpers/truncateCoefs';
import Plot from '../Plot';
import Formula from '../Formula';

@inject('main')
@observer
class Comparison extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    // const lsPlot = (
    //   <Plot
    //     id="comp_ls_plot"
    //     legend={false}
    //     plotData={[
    //       {
    //         x: this.props.main.lssq.x_approx,
    //         y: this.props.main.lssq.f_x_approx
    //       },
    //       {
    //         x: this.props.main.lssq.x_approx,
    //         y: this.props.main.lssq.approximation
    //       },
    //       { ...this.props.main.lssq.max_error_line, line: { color: '#f00' } }
    //     ]}
    //   />
    // );
    // const mmPlot = (
    //   <Plot
    //     id="comp_mm_plot"
    //     legend={false}
    //     plotData={[
    //       {
    //         x: this.props.main.minmax.func_plot[0],
    //         y: this.props.main.minmax.func_plot[1]
    //       },
    //       {
    //         x: this.props.main.minmax.pol_plot[0],
    //         y: this.props.main.minmax.pol_plot[1]
    //       }
    //     ]}
    //   />
    // );
    // const errsPlot = (
    //   <Plot
    //     id="comp_err_plot"
    //     title="Функції похибок"
    //     plotData={[
    //       { ...this.props.main.lssq.error_plot, name: 'МНК' },
    //       {
    //         x: this.props.main.minmax.error_plot[0],
    //         y:
    //           this.props.main.minmax.error_plot.length > 0
    //             ? this.props.main.minmax.error_plot[1].map(y => -y)
    //             : this.props.main.minmax.error_plot[1],
    //         name: 'Мінімакс'
    //       }
    //     ]}
    //   />
    // );
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Form
          formData={this.props.main.formData}
          onCalcClick={this.props.main.clickCalcHandler}
          lssq={true}
          minmax={true}
        />
        {/* <div
          style={{
            width: '90vw',
            position: 'absolute',
            left: '-15vw',
            margin: '30px 0'
          }} */}
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
                  <TableRowColumn width={'20%'}>Макс похибка</TableRowColumn>
                  <TableRowColumn>
                    {this.props.main.minmax.max_err.toFixed(4)}
                  </TableRowColumn>
                  <TableRowColumn>
                    {this.props.main.lssq.max_error.toFixed(4)}
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn width={'20%'}>
                    x в якому макс похибка
                  </TableRowColumn>
                  <TableRowColumn>
                    {this.props.main.minmax.x_of_max_err.toFixed(4)}
                  </TableRowColumn>
                  <TableRowColumn>
                    {this.props.main.lssq.x_of_max_error.toFixed(4)}
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn width={'20%'}>
                    Аналітичний вигляд
                  </TableRowColumn>
                  <TableRowColumn>
                    <Formula
                      formula={this.props.main.minmax.polynom_latex.replace(
                        truncateCoefs(4),
                        '$1'
                      )}
                    />
                  </TableRowColumn>
                  <TableRowColumn>
                    <Formula
                      formula={this.props.main.lssq.formula.replace(
                        truncateCoefs(4),
                        '$1'
                      )}
                    />
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn width={'20%'}>Графіки</TableRowColumn>
                  {/* <TableRowColumn>{mmPlot}</TableRowColumn> */}
                  {/* <TableRowColumn>{lsPlot}</TableRowColumn> */}
                </TableRow>
              </TableBody>
            </Table>
            {/* {errsPlot} */}
          </CardText>
        </Card>
        {/* </div> */}
      </div>
    );
  }
}

export default Comparison;
