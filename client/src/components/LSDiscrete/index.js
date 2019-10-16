import React, { Component } from "react";
import { Table, TableBody, TableRow, TableRowColumn } from "material-ui/Table";
import { Card, CardText } from "material-ui/Card";
import { inject, observer } from "mobx-react";
// import IterationList from '../iteration-lists/IterationList';
import FormDiscrete from "../forms/FormDiscrete";
import Plot from "../Plot";
import truncateCoefs from "../../helpers/truncateCoefs";
import Formula from "../Formula";
import { LSSQ_DISCRETE_URL } from "../../../api/api-config";

@inject("loader")
@observer
class LS extends Component {
  constructor() {
    super();
    this.state = {
      data: null
    };
    this.clickCalcHandler = this.clickCalcHandler.bind(this);
  }
  clickCalcHandler(xPoints, yPoints, deg) {
    this.props.loader.showLoader();
    fetch(LSSQ_DISCRETE_URL, {
      method: "POST",
      body: JSON.stringify({ x_vals: xPoints, y_vals: yPoints, deg })
    })
      .then(r => r.json())
      .then(res => {
        this.props.loader.hideLoader();
        // const endTime = Date.now();
        this.setState({
          data: res
          // dataLS_discrete: res,
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
    return (
      <div>
        <FormDiscrete onCalcClick={this.clickCalcHandler} />
        {this.state.data && (
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
                        formula={this.state.data.formula.replace(
                          truncateCoefs(4),
                          "$1"
                        )}
                      />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      Значення <i>x</i> в якому досягається максимальна похибка
                    </TableRowColumn>
                    <TableRowColumn>
                      {this.state.data.x_error.toFixed(5)}
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>Максимальна похибка</TableRowColumn>
                    <TableRowColumn>
                      {this.state.data.max_error.toFixed(5)}
                    </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </CardText>

            <Plot
              data={[
                {
                  x: this.state.data.x_approx,
                  y: this.state.data.approximation,
                  name: "Апроксимація"
                },
                {
                  x: this.state.data.x_vals,
                  y: this.state.data.y_vals,
                  mode: "markers",
                  name: "Табл. дані"
                },
                {
                  ...this.state.data.max_error_line,
                  name: "Максимальна похибка",
                  mode: "lines"
                }
              ]}
            />
            <Plot
              layout={{ title: "Функція похибки" }}
              data={[{ ...this.state.data.error_plot }]}
            />
            <h1>{`Час рахування: ${this.state.data.computation_time.toFixed(
              2
            )}`}</h1>
          </Card>
        )}
      </div>
    );
  }
}

export default LS;
