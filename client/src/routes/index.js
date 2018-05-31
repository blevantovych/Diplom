import React from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ComparisonDiscrete from '../components/ComparisonDiscrete';
import Comparison from '../components/Comparison';
import LS from '../components/LS';
import LSDiscrete from '../components/LSDiscrete';
import Minmax from '../components/Minmax';
import MinmaxDiscrete from '../components/MinmaxDiscrete';
import MinmaxSpline from '../components/MinmaxSpline';
import Header from '../components/Header';
import Loader from '../components/loader';

const history = createBrowserHistory();

const Routes = () => (
  <Router history={history}>
    <MuiThemeProvider>
      <div style={{ height: '100%', width: '100%' }}>
        <Header />
        <Loader />
        <Route path="/comparison-discrete" component={ComparisonDiscrete} />
        <Route path="/comparison-continuous" component={Comparison} />
        <Route path="/ls" component={LS} />
        <Route path="/ls-discrete" component={LSDiscrete} />
        <Route path="/minmax" component={Minmax} />
        <Route path="/minmax-discrete" component={MinmaxDiscrete} />
        <Route path="/spline" component={MinmaxSpline} />
        <Route path="/" exact component={() => <Redirect to="/spline" />} />
      </div>
    </MuiThemeProvider>
  </Router>
);

export default Routes;
