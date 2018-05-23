import React, { Component } from 'react';
// import range from 'lodash.range';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Card, CardText } from 'material-ui/Card';
import { observer, inject } from 'mobx-react';
import { action, observable, toJS } from 'mobx';

import Plot from '../Plot';
import Formula from '../Formula';
import truncateCoefs from '../../helpers/truncateCoefs';
import Form from './ls-form';
import { LSSQ_URL } from '../../../api/api-config';

@inject('loader')
@observer
class LS extends Component {
  @observable data = null;
  constructor() {
    super();
    this.clickCalcHandler = this.clickCalcHandler.bind(this);
  }

  clickCalcHandler(func, deg, start, end, points) {
    this.props.loader.showLoader();

    fetch(LSSQ_URL, {
      method: 'POST',
      body: JSON.stringify({
        func,
        deg,
        start,
        end,
        points
      })
    })
      .then(res => res.json())
      .then(
        action(res => {
          this.props.loader.hideLoader();
          this.data = res;
          // const endTime = Date.now();
          // this.setState({
          //   dataLS: res,
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
      <div>
        <Form onCalcClick={this.clickCalcHandler} />

        {this.data && (
          <Card>
            <CardText>
              <Table>
                <TableBody displayRowCheckbox={false}>
                  <TableRow>
                    <TableRowColumn>
                      Аналітичний вигляд многочлена
                    </TableRowColumn>
                    <TableRowColumn>
                      <Formula
                        formula={this.data.formula.replace(
                          truncateCoefs(4),
                          '$1'
                        )}
                      />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      Значення <i>x</i> в якому досягається максимальна похибка
                    </TableRowColumn>
                    <TableRowColumn>
                      {this.data.x_of_max_error.toFixed(5)}
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>Максимальна похибка</TableRowColumn>
                    <TableRowColumn>
                      {this.data.max_error.toFixed(5)}
                    </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </CardText>

            <Plot
              id="ls_plot"
              plotData={[
                {
                  x: toJS(this.data.x_approx),
                  y: toJS(this.data.f_x_approx),
                  name: 'Функція'
                },
                {
                  x: toJS(this.data.x_approx),
                  y: toJS(this.data.approximation),
                  name: 'Апроксимація'
                },
                {
                  x: toJS(this.data.x_vals),
                  y: toJS(this.data.y_vals),
                  mode: 'markers',
                  name: 'Точки (викор. в МНК)'
                },
                {
                  ...toJS(this.data.max_error_line),
                  name: 'Максимальна похибка',
                  mode: 'lines'
                }
              ]}
            />
            <Plot
              id="ls_error"
              title="Функція похибки"
              plotData={[
                {
                  ...toJS(this.data.error_plot),
                  name: 'функція похибки'
                },
                {
                  x: toJS(this.data.max_error_line.x),
                  y: toJS(this.data.y_error_plot),
                  mode: 'lines',
                  name: 'макс. похибка'
                }
              ]}
            />
            <h1>{`Час рахування: ${this.data.computation_time.toFixed(2)}`}</h1>
          </Card>
        )}
      </div>
    );
  }
}

export default LS;
