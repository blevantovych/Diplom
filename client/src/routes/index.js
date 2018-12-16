import React, {Suspense} from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import Header from '../components/Header';
import Loader from '../components/loader';
import ProgressStyles from './ProgressStyles.scss';
import Main from '../components/Main';

const Comparison = React.lazy(() => import('../components/Comparison'));
const LS = React.lazy(() => import('../components/LS'));
const LSDiscrete = React.lazy(() => import('../components/LSDiscrete'));
const Minmax = React.lazy(() => import('../components/Minmax'));
const MinmaxDiscrete = React.lazy(() => import('../components/MinmaxDiscrete'));
// const ContinuousMinmaxSpline = React.lazy(() => import('../components/ContinuousMinmaxSpline'));
// const MinmaxSpline = React.lazy(() => import('../components/MinmaxSpline'));
// const ContinuousMinmaxSplineSegmentsSpecified = React.lazy(() => import('../components/ContinuousMinmaxSplineSegmentsSpecified'));
const ComparisonDiscrete = React.lazy(() => import('../components/ComparisonDiscrete'))
// const SplineMinmaxDiscrete = React.lazy(() => import('../components/SplineMinmaxDiscrete'));
const SplineWithPrecision = React.lazy(() => import('../components/Spline-with-precision'));
const SplineWithSpecifiendNumberOfSegments = React.lazy(() => import('../components/Spline-with-specified-number-of-segments'));


const history = createBrowserHistory();

class Fallback extends React.Component {
  componentDidMount () {
    nprogress.start()
  }

  componentWillUnmount () {
    nprogress.done();
  }

  render () {
    return null
  }
}

const suspend = Component => () => (
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
);

const Routes = () => (
  <Router>
    <div style={{ height: '100%', width: '100%'}}>
      <Main>
        <Route path="/comparison-discrete" component={suspend(ComparisonDiscrete)} />
        <Route path="/comparison-continuous" component={suspend(Comparison)} />
        <Route path="/ls" component={suspend(LS)} />
        <Route path="/ls-discrete" component={suspend(LSDiscrete)} />
        <Route path="/minmax" component={suspend(Minmax)} />
        <Route path="/minmax-discrete" component={suspend(MinmaxDiscrete)} />
        {/* <Route path="/spline" component={suspend(MinmaxSpline)} /> */}
        <Route path="/spline-with-specified-number-of-segments" component={suspend(SplineWithSpecifiendNumberOfSegments)} />
        <Route path="/spline-with-precision" component={suspend(SplineWithPrecision)} />
        {/* <Route path="/continuous-spline" component={suspend(ContinuousMinmaxSpline)} /> */}
        {/* <Route path="/spline-minmax-discrete" component={suspend(SplineMinmaxDiscrete)} /> */}
        {/* <Route */}
          {/* path="/continuous-spline-segments-specified" */}
          {/* component={suspend(ContinuousMinmaxSplineSegmentsSpecified)} */}
        {/* /> */}
        <Route path="/" exact component={() => <Redirect to="/spline" />} />
      </Main>

      {/* <Header /> */}
      <Loader />
     
    </div>
  </Router>
);

export default Routes;
