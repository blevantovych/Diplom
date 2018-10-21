import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FormDiscrete from '../forms/FormDiscrete';
import IterationListDiscreteMinmax from '../iteration-lists/IterationListDiscreteMinmax';
import { MINMAX_DISCRETE_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './api';

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
  clickCalcHandler(xPoints, yPoints, deg, pinnedPoints) {
    this.props.loader.showLoader();
    api(MINMAX_DISCRETE_URL,  {
      method: 'POST',
      body: JSON.stringify({
        x_vals: xPoints,
        y_vals: yPoints,
        deg,
        pinnedPoints: pinnedPoints.map(point => +point)
      })
    }).then(res => {
        this.props.loader.hideLoader();
        // const endTime = Date.now();

        this.setState({
          data: toArr(res)
          // message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      })
      .catch(({status, errPromise}) => {
        errPromise.then(err => {
          toast(err.message);
          this.props.loader.hideLoader();
        })
      });
  }
  render() {
    return (
      <div>
        <ToastContainer hideProgressBar={true} />
        <FormDiscrete onCalcClick={this.clickCalcHandler} pinPoints={true} />
        {/* {!this.state.data ? <FormDiscrete onCalcClick={this.clickCalcHandler} /> : null} */}
        {this.state.data ? (
          <IterationListDiscreteMinmax arr={this.state.data} />
        ) : null}
      </div>
    );
  }
}

export default MinmaxDiscrete;
