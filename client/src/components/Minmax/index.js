import React, { Component } from 'react';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import IterationList from '../iteration-lists/IterationList';
// import Form from '../forms/Form';
import { MINMAX_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';
import MinmaxForm from './minmax-form';

@observer
class Minmax extends Component {
  @observable data = null;
  constructor(props) {
    super(props);
    this.calculateMinmax = this.calculateMinmax.bind(this);
  }

  calculateMinmax(func, deg, start, end, precision) {
    // const startTime = Date.now();
    fetch(MINMAX_URL, {
      method: 'POST',
      body: JSON.stringify({
        func,
        start,
        end,
        deg,
        precision
      })
    })
      .then(r => r.json())
      .then(
        action(r => {
          // const endTime = Date.now();
          this.data = toArr(r);
          // this.setState({
          //   data: toArr(r),
          //   loaderActive: false,
          //   message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
          // });
        })
      )
      .catch(e => {
        console.error(`Something went wrong!\n ${e}`);
        this.setState({ loaderActive: false });
      });
  }

  render() {
    console.log(this.props);
    return (
      <div style={{ width: '100%', margin: '0 auto' }}>
        <MinmaxForm onCalcClick={this.calculateMinmax} />
        {this.data ? <IterationList arr={toJS(this.data)} /> : null}
      </div>
    );
  }
}

export default Minmax;
