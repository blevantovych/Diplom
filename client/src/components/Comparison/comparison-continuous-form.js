import React, { Component } from 'react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Form from '../forms/Form';

@observer
class LSForm extends Component {
  static propTypes = {
    onCalcClick: PropTypes.func
  };

  @observable data = null;
  @observable func = 'cos(x)';
  @observable deg = '2';
  @observable start = '1';
  @observable end = '3';
  @observable precision = '0.1';
  @observable points = '10';

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
  changePoints(val) {
    this.points = val;
  }

  render() {
    console.log(this.props);
    return (
      <div style={{ width: '100%', margin: '0 auto' }}>
        <Form
          func={this.func}
          deg={this.deg}
          start={this.start}
          end={this.end}
          precision={this.precision}
          points={this.points}
          onCalcClick={() =>
            this.props.onCalcClick(
              this.func,
              this.deg,
              this.start,
              this.end,
              this.points,
              this.precision
            )
          }
          changeFunc={this.changeFunc}
          changeDeg={this.changeDeg}
          changeStart={this.changeStart}
          changeEnd={this.changeEnd}
          changePrecision={this.changePrecision}
          changePoints={this.changePoints}
          lssq={true}
          minmax={true}
        />
      </div>
    );
  }
}

export default LSForm;
