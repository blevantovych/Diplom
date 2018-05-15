import React from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ComparisonDiscrete from '../components/ComparisonDiscrete';
import Comparison from '../components/Comparison';
import LS from '../components/LS';
import LSDiscrete from '../components/LSDiscrete';
import Minmax from '../components/Minmax';
import MinmaxDiscrete from '../components/MinmaxDiscrete';
import App from '../components/App';

const history = createBrowserHistory();

const Routes = () => (
  <Router history={history}>
    <MuiThemeProvider>
      <div style={{ height: '100%', width: '100%', border: '1px solid red' }}>
        <Route path="/" component={App} />
        <Route path="/comparison-discrete" component={ComparisonDiscrete} />
        <Route path="/comparison-continuous" component={Comparison} />
        <Route path="/ls" component={LS} />
        <Route path="/ls-discrete" component={LSDiscrete} />
        <Route path="/minmax" component={Minmax} />
        <Route path="/minmax-discrete" component={MinmaxDiscrete} />
      </div>
    </MuiThemeProvider>
  </Router>
);

export default Routes;
