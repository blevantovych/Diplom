import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

import Plot from '../Plot';
import Formula from '../Formula';
import truncateCoefs from '../../helpers/truncateCoefs';
import styled from 'styled-components';

const HeaderCell = styled.th`
  width: 100px;
  border: 1px solid black;
  text-align: center;
  padding: 10px;
`;

const Cell = styled.td`
  width: 100px;
  border: 1px solid black;
  text-align: center;
  padding: 5px;  
`;

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
      <TableRowColumn key="Точка альтернансу">
        <h4>Точка альтернансу</h4>
      </TableRowColumn>
    );

    const err_alt = this.props.data.err_in_each_point.map((el, i) => {
      return <TableRowColumn key={i}>{el.toFixed(7)}</TableRowColumn>;
    });
    err_alt.unshift(
      <TableRowColumn key={'error'}>
        <h4>Похибка</h4>
      </TableRowColumn>
    );

    console.log(this.props.data.formula)
    const match = this.props.data.formula.match(/x\^{(\d)}/);
    const degree = match ? match[1] : 0;
  
    const DemoTable = (
      <div>
        <table style={{borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <HeaderCell>H, A/м</HeaderCell>
              <HeaderCell>В, Тл</HeaderCell>
              <HeaderCell>В обчислене</HeaderCell>
              <HeaderCell>Похибка, Тл</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {this.props.data.err_in_each_x.map((x, i) =>
              <tr key={i}>
                <Cell>{this.props.data.x_vals[i]}</Cell>
                <Cell>{this.props.data.y_vals[i]}</Cell>
                <Cell>{Math.abs(this.props.data.approximation_in_each_x[i]) < 1e-10 ? 0 : this.props.data.approximation_in_each_x[i].toFixed(7)}</Cell>
                <Cell>{Math.abs(-x) < 1e-10 ? 0 : (-x).toFixed(7)}</Cell>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{marginTop: '20px', fontSize: '18px', marginLeft: '50px'}}>
          <Formula
              degree={degree}
              demo={this.props.demo}
              formula={this.props.data.formula.replace(
                truncateCoefs(10),
                '$1'
              )}
            />
        </div>
      </div>);

    return (this.props.demo
      ? DemoTable
      : <div>
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
