import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

import Plot from '../Plot';
import Formula from '../Formula';
import truncateCoefs from '../../helpers/truncateCoefs';

export default class IterationMinmaxDiscrete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpandChange = expanded => {
    this.setState({ expanded: expanded });
  };

  render() {
    const alt = this.props.data.alternance.map((el, i) => {
      return (
        <TableRowColumn key={i}>
          {el.toFixed(7).replace(/0+$/, '0')}
        </TableRowColumn>
      );
    });
    alt.unshift(
      <TableRowColumn>
        <h4>Точка альтернансу</h4>
      </TableRowColumn>
    );

    const err_alt = this.props.data.err_in_each_point.map((el, i) => {
      return <TableRowColumn key={i}>{el.toFixed(7)}</TableRowColumn>;
    });
    err_alt.unshift(
      <TableRowColumn>
        <h4>Похибка</h4>
      </TableRowColumn>
    );

    return (
      <div>
        <Card
          style={{ margin: '20px 0' }}
          expanded={this.state.expanded}
          onExpandChange={this.handleExpandChange}
        >
          <CardHeader
            title={'Ітерація ' + (this.props.ctn + 1)}
            actAsExpander={true}
            showExpandableButton={true}
          />

          <CardText expandable={true}>
            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow>{alt}</TableRow>
                <TableRow>{err_alt}</TableRow>
              </TableBody>
            </Table>
            <br />

            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn>Максимальна похибка</TableRowColumn>
                  <TableRowColumn>
                    {this.props.data.max_error.toFixed(7)}
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    Значення <i>x</i> в якому досягається максимальна похибка
                  </TableRowColumn>
                  <TableRowColumn>
                    {this.props.data.x_error.toFixed(7)}
                  </TableRowColumn>
                </TableRow>

                <TableRow>
                  <TableRowColumn>Аналітичний вигляд многочлена</TableRowColumn>
                  <TableRowColumn>
                    <Formula
                      formula={this.props.data.formula.replace(
                        truncateCoefs(4),
                        '$1'
                      )}
                    />
                  </TableRowColumn>
                </TableRow>
                {/*<TableRow>
                                    <TableRowColumn>For desmos</TableRowColumn>
                                    <TableRowColumn>{this.props.data.polynom_latex.replace(truncateCoefs(4), '$1')}</TableRowColumn>
                                </TableRow>*/}
              </TableBody>
            </Table>
            <Plot
              id={'minmax_discrete_plot' + this.props.ctn}
              plotData={[
                //{x: this.props.data.x_approx, y: this.props.data.f_x_approx, name: 'Функція'},
                {
                  x: this.props.data.x_approx,
                  y: this.props.data.approximation,
                  name: 'Апроксимація'
                },
                {
                  x: this.props.data.x_vals,
                  y: this.props.data.y_vals,
                  mode: 'markers',
                  name: 'Табл. дані'
                },
                {
                  x: this.props.data.alternance,
                  y: this.props.data.f_alternance,
                  mode: 'markers',
                  name: 'Точки альтернансу'
                },
                {
                  ...this.props.data.max_error_line,
                  name: 'Максимальна похибка'
                }
              ]}
            />
            <Plot
              legend={false}
              id={'minmax_error_func' + this.props.ctn}
              plotData={[
                {
                  x: this.props.data.error_plot[0],
                  y: this.props.data.error_plot[1]
                },
                {
                  x: this.props.data.alternance,
                  y: this.props.data.error_plot[1].filter(
                    (_, i) =>
                      this.props.data.alternance.indexOf(
                        this.props.data.error_plot[0][i]
                      ) !== -1
                  ),
                  mode: 'markers'
                }
              ]}
              title={'Графік функції похибки'}
            />
          </CardText>
        </Card>
      </div>
    );
  }
}
