import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Card, CardText } from 'material-ui/Card';
import { observer, inject } from 'mobx-react';
import truncateCoefs from '../../helpers/truncateCoefs';
import Plot from '../Plot';
import FormComparisonContinuous from './comparison-continuous-form';
import Formula from '../Formula';
import { LSSQ_URL, MINMAX_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';

@inject('loader')
@observer
class Comparison extends Component {
  constructor(props) {
    super(props);
    this.clickCalcHandler = this.clickCalcHandler.bind(this);
    this.state = {
      lssq: null,
      minmax: null
    };
  }

  clickCalcHandler(func, deg, start, end, points, precision) {
    this.props.loader.showLoader();
    const lssq = () =>
      fetch(LSSQ_URL, {
        method: 'POST',
        body: JSON.stringify({ func, start: +start, end: +end, deg: +deg, points: +points })
      }).then(res => res.json());

    const minmax = () =>
      fetch(MINMAX_URL, {
        method: 'POST',
        body: JSON.stringify({ func, start: +start, end: +end, deg: +deg, precision: +precision })
      }).then(res => res.json());
    // const startTime = Date.now();
    Promise.all([lssq(), minmax()])
      .then(data => {
        this.props.loader.hideLoader();

        this.setState({
          lssq: data[0],
          minmax: toArr(data[1]).slice(-1)[0]
        });
      })
      .catch(e => {
        console.error(`Something went wrong!\n ${e}`);
        this.props.loader.hideLoader();
      });
  }

  render() {
    if (this.state.lssq && this.state.minmax) {
      const lsPlot = (
        <Plot
          legend={false}
          data={[
            {
              x: this.state.lssq.x_approx,
              y: this.state.lssq.f_x_approx
            },
            {
              x: this.state.lssq.x_approx,
              y: this.state.lssq.approximation
            },
            { ...this.state.lssq.max_error_line, line: { color: '#f00' } }
          ]}
        />
      );
      const mmPlot = (
        <Plot
          layout={{showlegend: false}}
          data={[
            {
              x: this.state.minmax.func_plot[0],
              y: this.state.minmax.func_plot[1]
            },
            {
              x: this.state.minmax.pol_plot[0],
              y: this.state.minmax.pol_plot[1]
            }
          ]}
        />
      );
      const errsPlot = (
        <Plot
          layout={{title: "Функції похибок"}}
          data={[
            { ...this.state.lssq.error_plot, name: 'МНК' },
            {
              x: this.state.minmax.error_plot[0],
              y:
                this.state.minmax.error_plot.length > 0
                  ? this.state.minmax.error_plot[1].map(y => -y)
                  : this.state.minmax.error_plot[1],
              name: 'Мінімакс'
            }
          ]}
        />
      );
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
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
                    <TableRowColumn width={'20%'}>Макс похибка</TableRowColumn>
                    <TableRowColumn>
                      {this.state.minmax.max_err.toFixed(4)}
                    </TableRowColumn>
                    <TableRowColumn>
                      {this.state.lssq.max_error.toFixed(4)}
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn width={'20%'}>
                      x в якому макс похибка
                    </TableRowColumn>
                    <TableRowColumn>
                      {this.state.minmax.x_of_max_err.toFixed(4)}
                    </TableRowColumn>
                    <TableRowColumn>
                      {this.state.lssq.x_of_max_error.toFixed(4)}
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn width={'20%'}>
                      Аналітичний вигляд
                    </TableRowColumn>
                    <TableRowColumn>
                      <Formula
                        formula={this.state.minmax.polynom_latex.replace(
                          truncateCoefs(4),
                          '$1'
                        )}
                      />
                    </TableRowColumn>
                    <TableRowColumn>
                      <Formula
                        formula={this.state.lssq.formula.replace(
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
      );
    } else {
      return <FormComparisonContinuous onCalcClick={this.clickCalcHandler} />;
    }
  }
}

export default Comparison;
