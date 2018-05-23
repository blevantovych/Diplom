import React, { Component } from 'react';
import { observable, action, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import IterationList from '../iteration-lists/IterationList';
// import Form from '../forms/Form';
import { SPLINE_MINMAX_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';
import SplineForm from './spline-form';

@inject('loader')
@observer
class Minmax extends Component {
  @observable data = null;
  constructor(props) {
    super(props);
    this.calculateMinmax = this.calculateMinmax.bind(this);
  }

  calculateMinmax(func, deg, start, end, precision, allowed_error) {
    // const startTime = Date.now();
    this.props.loader.showLoader();
    fetch(SPLINE_MINMAX_URL, {
      method: 'POST',
      body: JSON.stringify({
        func,
        start,
        end,
        deg,
        precision,
        allowed_error
      })
    })
      .then(r => r.json())
      .then(
        action(r => {
          this.props.loader.hideLoader();

          console.log(r);
          // const endTime = Date.now();
          // this.data = toArr(r);
          // this.setState({
          //   data: toArr(r),
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
      <div style={{ width: '100%', margin: '0 auto' }}>
        <SplineForm onCalcClick={this.calculateMinmax} />
        {this.data ? <IterationList arr={toJS(this.data)} /> : null}
      </div>
    );
  }
}

export default Minmax;
