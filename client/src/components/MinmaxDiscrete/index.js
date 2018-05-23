import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FormDiscrete from '../forms/FormDiscrete';
import IterationListDiscreteMinmax from '../iteration-lists/IterationListDiscreteMinmax';
import { MINMAX_DISCRETE_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';

@inject('loader')
@observer
class MinmaxDiscrete extends Component {
  constructor() {
    super();
    this.state = {
      data: null
    };
    this.clickCalcHandler = this.clickCalcHandler.bind(this);
  }
  clickCalcHandler(xPoints, yPoints, deg) {
    this.props.loader.showLoader();

    fetch(MINMAX_DISCRETE_URL, {
      method: 'POST',
      body: JSON.stringify({ x_vals: xPoints, y_vals: yPoints, deg })
    })
      .then(r => r.json())
      .then(res => {
        this.props.loader.hideLoader();
        // const endTime = Date.now();

        this.setState({
          data: toArr(res)
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
        {this.state.data ? (
          <IterationListDiscreteMinmax arr={this.state.data} />
        ) : null}
      </div>
    );
  }
}

export default MinmaxDiscrete;
