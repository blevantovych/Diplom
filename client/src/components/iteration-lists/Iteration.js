import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

import truncateCoefs from '../../helpers/truncateCoefs';
import Plot from '../Plot';
import Formula from '../Formula';

class Iteration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpandChange = expanded => {
    this.setState({ expanded });
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
      <TableRowColumn key="alternance_point">
        <h4>Точка альтернансу</h4>
      </TableRowColumn>
    );

    const err_alt = this.props.data.err_in_each_point.map((el, i) => {
      return <TableRowColumn key={i}>{el.toFixed(7)}</TableRowColumn>;
    });
    err_alt.unshift(
      <TableRowColumn key="error">
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
                  <TableRowColumn key="label">
                    Максимальна похибка
                  </TableRowColumn>
                  <TableRowColumn key="value">
                    {this.props.data.max_err.toFixed(7)}
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn key="label">
                    Значення <i>x</i> в якому досягається максимальна похибка
                  </TableRowColumn>
                  <TableRowColumn key="value">
                    {this.props.data.x_of_max_err.toFixed(7)}
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn key="label">
                    {this.props.isLast
                      ? 'Алгоритм закінчено бо '
                      : 'Продовжуємо алгоритм бо '}
                  </TableRowColumn>
                  <TableRowColumn key="value">
                    {this.props.data.err_diff &&
                      this.props.data.err_diff.toFixed(7)}
                    {this.props.isLast ? ' < ' : ' > '}
                    {this.props.precision}
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn key="label">
                    Аналітичний вигляд многочлена
                  </TableRowColumn>
                  <TableRowColumn key="value">
                    <div>
                      <Formula
                        formula={this.props.data.polynom_latex.replace(
                          truncateCoefs(4),
                          '$1'
                        )}
                      />
                    </div>
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
            <Plot
              id={`${this.props.ctn + 1}`}
              plotData={[
                {
                  x: this.props.data.error_plot[0],
                  y: this.props.data.error_plot[1]
                }
              ]}
              title={'Графік функції похибки'}
            />
          </CardText>
        </Card>
        {this.props.isLast && (
          <Card>
            <Plot
              id={this.props.ctn + 1 + 'polynom'}
              title={'Функція і наближення многочленом'}
              plotData={[
                {
                  x: this.props.data.pol_plot[0],
                  y: this.props.data.pol_plot[1],
                  name: 'p(x)'
                },
                {
                  x: this.props.data.func_plot[0],
                  y: this.props.data.func_plot[1],
                  name: 'f(x)'
                }
              ]}
            />
          </Card>
        )}
      </div>
    );
  }
}

Iteration.propTypes = {
  data: PropTypes.shape({
    pol_plot: PropTypes.array,
    func_plot: PropTypes.array,
    error_plot: PropTypes.array,
    alternance: PropTypes.array,
    err_in_each_point: PropTypes.array,
    max_err: PropTypes.number,
    x_of_max_err: PropTypes.number,
    err_diff: PropTypes.number,
    polynom_latex: PropTypes.string
  }),
  precision: PropTypes.number,
  ctn: PropTypes.number,
  isLast: PropTypes.bool
};

export default Iteration;
