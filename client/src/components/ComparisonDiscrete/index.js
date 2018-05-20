import React from 'react';
import { observer, inject } from 'mobx-react';

import ComparisonDiscrete from './ComparisonDiscrete';
// import Header from '../Header';

const Container = ({}) => (
  <React.Fragment>
    {/* <Header title={'Порівняти Мінімакс і МНК'} /> */}
    <ComparisonDiscrete
    // clickCalcHandler={this.clickDiscreteCompare}
    // formData={formsStates.compare_discrete}
    // minmaxData={this.state.dataCompareMinmaxDiscrete}
    // lssqData={this.state.dataCompareLssqDiscrete}
    />
  </React.Fragment>
);

export default inject('main')(observer(Container));
