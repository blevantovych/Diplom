import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Form from '../forms/spline-form';

@observer
class SplineMinmaxForm extends Component {
  @observable data = null;
  @observable func = 'sin(x)';
  @observable deg = '2';
  @observable start = '1';
  @observable end = '3';
  @observable precision = '0.1';
  @observable allowedErrorOnSplineSegment = '0.1';

  @action.bound
  changeFunc(val) {
    this.func = val;
  }

  @action.bound
  changeDeg(val) {
    this.deg = val;
  }

  @action.bound
  changeStart(val) {
    this.start = val;
  }

  @action.bound
  changeEnd(val) {
    this.end = val;
  }

  @action.bound
  changePrecision(val) {
    this.precision = val;
  }

  @action.bound
  changeAllowedError(val) {
    this.allowedErrorOnSplineSegment = val;
  }

  render() {
    return (
      <div style={{ width: '100%', margin: '0 auto' }}>
        <Form
          func={this.func}
          deg={this.deg}
          start={this.start}
          end={this.end}
          precision={this.precision}
          allowedErrorOnSplineSegment={this.allowedErrorOnSplineSegment}
          onCalcClick={() =>
            this.props.onCalcClick(
              this.func,
              this.deg,
              this.start,
              this.end,
              this.precision,
              this.allowedErrorOnSplineSegment
            )
          }
          changeFunc={this.changeFunc}
          changeDeg={this.changeDeg}
          changeStart={this.changeStart}
          changeEnd={this.changeEnd}
          changePrecision={this.changePrecision}
          changeAllowedError={this.changeAllowedError}
        />
      </div>
    );
  }
}

export default SplineMinmaxForm;
