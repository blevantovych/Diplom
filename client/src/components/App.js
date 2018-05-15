import React from 'react';
import { Link } from 'react-router-dom';
import Routes from '../routes';
import Header from './Header';
import Loader from './loader';
// import LS from './LS';
// import LSDiscrete from './LSDiscrete';
// import Minmax from './Minmax';
// import MinmaxDiscrete from './MinmaxDiscrete';
// import Comparison from './Comparison';
// import ComparisonDiscrete from './ComparisonDiscrete';
// import History from './History';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';

// import './main.scss';

// import toArr from '../helpers/toArr';
import injectTapEventPlugin from 'react-tap-event-plugin';

// import formsStates from './formsStates';

// import {
//   MINMAX_URL,
//   LSSQ_URL,
//   LSSQ_DISCRETE_URL,
//   MINMAX_DISCRETE_URL
// } from './URLS';

// const base = Rebase.createClass('https://diplom-ff14d.firebaseio.com/')
const NavBar = () => (
  <ul>
    <li>
      <Link to="/comparisonDiscrete">Comparison discrete</Link>
    </li>
    <li>
      <Link to="/comparison">Comparison</Link>
    </li>
    <li>
      <Link to="/ls">ls</Link>
    </li>
    <li>
      <Link to="/lsDiscrete">lsDiscrete</Link>
    </li>
    <li>
      <Link to="/minmax">minmax</Link>
    </li>
    <li>
      <Link to="/minmax-discrete">minmax-discrete</Link>
    </li>
  </ul>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    // injectTapEventPlugin();
  }

  getMaxErrs = (func, start, end, deg, precision, points) => {
    this.setState({
      loaderActive: true,
      message: ''
    });
    const lssq = () =>
      fetch(LSSQ_URL, {
        method: 'POST',
        body: JSON.stringify({ func, start, end, deg, points })
      }).then(res => res.json());

    const minmax = () =>
      fetch(MINMAX_URL, {
        method: 'POST',
        body: JSON.stringify({ func, start, end, deg, precision })
      }).then(res => res.json());
    const startTime = Date.now();
    Promise.all([lssq(), minmax()])
      .then(data => {
        const endTime = Date.now();
        this.setState({
          comparison: {
            lssq: data[0],
            minmax: toArr(data[1]).last()
          },
          loaderActive: false,
          message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      })
      .catch(e => {
        console.error(`Something went wrong!\n ${e}`);
        this.setState({ loaderActive: false });
      });
  };

  clickCalcLSHandler = (func, start, end, deg, precision, points) => {
    this.setState({
      loaderActive: true,
      message: ''
    });
    const startTime = Date.now();
    fetch(LSSQ_URL, {
      method: 'POST',
      body: JSON.stringify({
        func,
        deg,
        start,
        end,
        points
      })
    })
      .then(res => res.json())
      .then(res => {
        const endTime = Date.now();
        this.setState({
          dataLS: res,
          loaderActive: false,
          message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      })
      .catch(e => {
        console.error(`Something went wrong!\n ${e}`);
        this.setState({ loaderActive: false });
      });
  };

  clickCalcLSDiscreteHandler = (x_vals, y_vals, deg) => {
    this.setState({
      loaderActive: true,
      message: ''
    });

    const startTime = Date.now();

    fetch(LSSQ_DISCRETE_URL, {
      method: 'POST',
      body: JSON.stringify({ x_vals, y_vals, deg })
    })
      .then(r => r.json())
      .then(res => {
        const endTime = Date.now();
        this.setState({
          dataLS_discrete: res,
          loaderActive: false,
          message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      });
  };

  clickMinmaxDiscreteHandler = (x_vals, y_vals, deg) => {
    this.setState({
      loaderActive: true,
      message: ''
    });

    const startTime = Date.now();

    fetch(MINMAX_DISCRETE_URL, {
      method: 'POST',
      body: JSON.stringify({ x_vals, y_vals, deg })
    })
      .then(r => r.json())
      .then(res => {
        const endTime = Date.now();

        this.setState({
          dataMinmax_discrete: toArr(res),
          loaderActive: false,
          message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      });
  };

  clickCalcMinmaxHandler = (func, start, end, deg, precision) => {
    this.setState({
      loaderActive: true,
      message: ''
    });
    const startTime = Date.now();
    fetch(MINMAX_URL, {
      method: 'POST',
      body: JSON.stringify({ func, start, end, deg, precision })
    })
      .then(r => r.json())
      .then(r => {
        const endTime = Date.now();
        this.setState({
          data: toArr(r),
          loaderActive: false,
          message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      })
      .catch(e => {
        console.error(`Something went wrong!\n ${e}`);
        this.setState({ loaderActive: false });
      });
  };

  clickDiscreteCompare = (x_vals, y_vals, deg) => {
    let points = x_vals.map((x, i) => ({
      x,
      y: y_vals[i]
    }));

    const lssqDiscrete = fetch(LSSQ_DISCRETE_URL, {
      method: 'POST',
      body: JSON.stringify({ x_vals, y_vals, deg })
    }).then(r => r.json());

    const minmaxDiscrete = fetch(MINMAX_DISCRETE_URL, {
      method: 'POST',
      body: JSON.stringify({ x_vals, y_vals, deg })
    }).then(r => r.json());

    this.setState({
      loaderActive: true,
      message: ''
    });
    const startTime = Date.now();
    Promise.all([lssqDiscrete, minmaxDiscrete]).then(data => {
      const endTime = Date.now();
      this.setState({
        dataCompareMinmaxDiscrete: toArr(data[1]),
        dataCompareLssqDiscrete: data[0],
        loaderActive: false,
        message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
      });
    });
  };

  render() {
    // const style = { position: 'relative', top: '60px', marginBottom: '60px' };
    // let view;
    // if (this.state.viewId === 1) {
    //   view = (
    //     <div style={style}>
    //       <Header title={'МНК'} onMenuChange={this.onMenuChange} />
    //       <LS
    //         clickCalcHandler={this.clickCalcLSHandler}
    //         formData={formsStates.lssq}
    //         data={this.state.dataLS}
    //       />
    //     </div>
    //   );
    // } else if (this.state.viewId === 2) {
    //   view = (
    //     <div style={style}>
    //       <Header title={'Мінімакс'} onMenuChange={this.onMenuChange} />
    //       <Minmax
    //         formData={formsStates.minmax}
    //         clickCalcHandler={this.clickCalcMinmaxHandler}
    //         data={this.state.data}
    //       />
    //     </div>
    //   );
    // } else if (this.state.viewId === 3) {
    //   view = (
    //     <div style={style}>
    //       <Header
    //         title={'Порівняти Мінімакс і МНК'}
    //         onMenuChange={this.onMenuChange}
    //       />
    //       <Comparison
    //         formData={formsStates.comp}
    //         clickCalcHandler={this.getMaxErrs}
    //         minmax={this.state.comparison.minmax}
    //         lssq={this.state.comparison.lssq}
    //       />
    //     </div>
    //   );
    // } else if (this.state.viewId === 4) {
    //   view = (
    //     <div style={style}>
    //       <Header title={'Історія'} onMenuChange={this.onMenuChange} />
    //       <History
    //         history={this.state.history}
    //         onItemClick={this.handleHistory}
    //       />
    //     </div>
    //   );
    // } else if (this.state.viewId === 5) {
    //   view = (
    //     <div style={style}>
    //       <Header
    //         title={'МНК (дискретна функція)'}
    //         onMenuChange={this.onMenuChange}
    //       />
    //       <LSDiscrete
    //         clickCalcHandler={this.clickCalcLSDiscreteHandler}
    //         formData={formsStates.lssq_discrete}
    //         data={this.state.dataLS_discrete}
    //       />
    //     </div>
    //   );
    // } else if (this.state.viewId === 6) {
    //   view = (
    //     <div style={style}>
    //       <Header
    //         title={'Мінімакс (дискретна функція)'}
    //         onMenuChange={this.onMenuChange}
    //       />
    //       <MinmaxDiscrete
    //         clickCalcHandler={this.clickMinmaxDiscreteHandler}
    //         formData={formsStates.minmax_discrete}
    //         data={this.state.dataMinmax_discrete}
    //       />
    //     </div>
    //   );
    // } else if (this.state.viewId === 7) {
    //   view = <div style={style} />;
    // }

    return (
      <MuiThemeProvider>
        <Header />
        {/* <Routes>
          <div style={{ width: '60vw', margin: 'auto' }}>
            <h1>links</h1>
            <Link to="/comparison-discrete">Comparison discrete</Link>
            <Link to="/comparison">Comparison</Link>
            <Link to="/ls">ls</Link>
            <Link to="/ls-discrete">ls-discrete</Link>
            <Link to="/minmax">minmax</Link>
            <Link to="/minmax-discrete">minmax-discrete</Link>

            <Loader active={false} />
            <Snackbar
              open={false}
              message={''}
              autoHideDuration={4000}
              bodyStyle={{ backgroundColor: 'rgb(0, 188, 212)' }}
            />
          </div>
        </Routes> */}
      </MuiThemeProvider>
    );
  }
}

export default App;
