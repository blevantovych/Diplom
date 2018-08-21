import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import FormDiscrete from '../forms/FormDiscrete';
// import IterationListDiscreteMinmax from '../iteration-lists/IterationListDiscreteMinmax';
import { CONTINUOUS_SPLINE_MINMAX_URL } from '../../../api/api-config';
// import toArr from '../../helpers/toArr';
import ContinuousSplineMinmaxForm from './form';

@inject('loader')
@observer
class ContinuousMinmaxSpline extends Component {
  constructor() {
    super();
    this.state = {
      data: null
    };
    this.calculate = this.calculate.bind(this);
  }

  // notify = () => toast("Wow so easy !");

  calculate(func, degree, start, end, precision, allowed_error) {
    this.props.loader.showLoader();
    console.log({ func, degree, start, end, precision, allowed_error });

    fetch(CONTINUOUS_SPLINE_MINMAX_URL, {
      method: 'POST',
      body: JSON.stringify({
        func,
        degree,
        start,
        end,
        precision,
        allowed_error
      })
    })
      .then(r => r.json())
      .then(val => console.log(val))
    //   .then(res => {
    //     this.props.loader.hideLoader();
    //     // const endTime = Date.now();

    //     this.setState({
    //       data: toArr(res)
    //       // message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
    //     });
    //   })
    //   .catch(e => {
    //     console.log(e);
    //     this.props.loader.hideLoader();
    //   });
  }
  render() {
    return (
      <div>
        <ContinuousSplineMinmaxForm onCalcClick={this.calculate} />

        {/* <FormDiscrete onCalcClick={this.clickCalcHandler} />
        {this.state.data ? (
          <IterationListDiscreteMinmax arr={this.state.data} />
        ) : null} */}
      </div>
    );
  }
}

export default ContinuousMinmaxSpline;
