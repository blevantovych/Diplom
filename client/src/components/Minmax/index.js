import React, { Component } from 'react';

import IterationList from '../iteration-lists/IterationList';
import Form from '../forms/Form';

class Minmax extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Form
          formData={this.props.formData}
          onCalcClick={this.props.clickCalcHandler}
          minmax={true}
        />
        {/* <IterationList arr={this.props.data} /> */}
      </div>
    );
  }
}

export default Minmax;
