import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FormDiscrete from '../forms/FormDiscrete';
import IterationListDiscreteMinmax from '../iteration-lists/IterationListDiscreteMinmax';
import { MINMAX_DISCRETE_URL } from '../../../api/api-config';
import toArr from '../../helpers/toArr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './api';
// import jsPDF from 'jspdf';

const demo = false;

@inject('loader')
@observer
class MinmaxDiscrete extends Component {
  constructor() {
    super();
    this.state = {
      data: null
    };
    this.clickCalcHandler = this.clickCalcHandler.bind(this);
  }
  clickCalcHandler(xPoints, yPoints, deg, pinnedPoints) {
    this.props.loader.showLoader();
    if (demo) {
      document.querySelector('#header').remove()
    }
    // var pdf = new jsPDF('p', 'pt', 'letter');
    // pdf.canvas.height = 80 * 11;
    // pdf.canvas.width = 80 * 8.5;    
    // pdf.fromHTML(`<table style="border-collapse: collapse;"><thead><tr><th class="sc-htoDjs eLHmCC">H, A/м</th><th class="sc-htoDjs eLHmCC">В, Тл</th><th class="sc-htoDjs eLHmCC">В обчислене</th><th class="sc-htoDjs eLHmCC">Похибка, Тл</th></tr></thead><tbody><tr><td class="sc-dnqmqq bdcvYW">0</td><td class="sc-dnqmqq bdcvYW">0</td><td class="sc-dnqmqq bdcvYW">0.4688850</td><td class="sc-dnqmqq bdcvYW">-0.4688850</td></tr><tr><td class="sc-dnqmqq bdcvYW">0.0001</td><td class="sc-dnqmqq bdcvYW">0.1</td><td class="sc-dnqmqq bdcvYW">0.4688913</td><td class="sc-dnqmqq bdcvYW">-0.3688913</td></tr><tr><td class="sc-dnqmqq bdcvYW">0.25</td><td class="sc-dnqmqq bdcvYW">0.2</td><td class="sc-dnqmqq bdcvYW">0.4846208</td><td class="sc-dnqmqq bdcvYW">-0.2846208</td></tr><tr><td class="sc-dnqmqq bdcvYW">0.5</td><td class="sc-dnqmqq bdcvYW">0.3</td><td class="sc-dnqmqq bdcvYW">0.5003179</td><td class="sc-dnqmqq bdcvYW">-0.2003179</td></tr><tr><td class="sc-dnqmqq bdcvYW">0.625</td><td class="sc-dnqmqq bdcvYW">0.4</td><td class="sc-dnqmqq bdcvYW">0.5081519</td><td class="sc-dnqmqq bdcvYW">-0.1081519</td></tr><tr><td class="sc-dnqmqq bdcvYW">0.8</td><td class="sc-dnqmqq bdcvYW">0.5</td><td class="sc-dnqmqq bdcvYW">0.5191031</td><td class="sc-dnqmqq bdcvYW">-0.0191031</td></tr><tr><td class="sc-dnqmqq bdcvYW">1.1</td><td class="sc-dnqmqq bdcvYW">0.6</td><td class="sc-dnqmqq bdcvYW">0.5378324</td><td class="sc-dnqmqq bdcvYW">0.0621676</td></tr><tr><td class="sc-dnqmqq bdcvYW">1.3</td><td class="sc-dnqmqq bdcvYW">0.7</td><td class="sc-dnqmqq bdcvYW">0.5502876</td><td class="sc-dnqmqq bdcvYW">0.1497124</td></tr><tr><td class="sc-dnqmqq bdcvYW">1.55</td><td class="sc-dnqmqq bdcvYW">0.8</td><td class="sc-dnqmqq bdcvYW">0.5658216</td><td class="sc-dnqmqq bdcvYW">0.2341784</td></tr><tr><td class="sc-dnqmqq bdcvYW">1.8</td><td class="sc-dnqmqq bdcvYW">0.9</td><td class="sc-dnqmqq bdcvYW">0.5813168</td><td class="sc-dnqmqq bdcvYW">0.3186832</td></tr><tr><td class="sc-dnqmqq bdcvYW">2.325</td><td class="sc-dnqmqq bdcvYW">1</td><td class="sc-dnqmqq bdcvYW">0.6137303</td><td class="sc-dnqmqq bdcvYW">0.3862697</td></tr><tr><td class="sc-dnqmqq bdcvYW">2.85</td><td class="sc-dnqmqq bdcvYW">1.1</td><td class="sc-dnqmqq bdcvYW">0.6459726</td><td class="sc-dnqmqq bdcvYW">0.4540274</td></tr><tr><td class="sc-dnqmqq bdcvYW">4.25</td><td class="sc-dnqmqq bdcvYW">1.2</td><td class="sc-dnqmqq bdcvYW">0.7311150</td><td class="sc-dnqmqq bdcvYW">0.4688850</td></tr><tr><td class="sc-dnqmqq bdcvYW">6.375</td><td class="sc-dnqmqq bdcvYW">1.3</td><td class="sc-dnqmqq bdcvYW">0.8580228</td><td class="sc-dnqmqq bdcvYW">0.4419772</td></tr><tr><td class="sc-dnqmqq bdcvYW">10.5</td><td class="sc-dnqmqq bdcvYW">1.4</td><td class="sc-dnqmqq bdcvYW">1.0963660</td><td class="sc-dnqmqq bdcvYW">0.3036340</td></tr><tr><td class="sc-dnqmqq bdcvYW">19.25</td><td class="sc-dnqmqq bdcvYW">1.5</td><td class="sc-dnqmqq bdcvYW">1.5669542</td><td class="sc-dnqmqq bdcvYW">-0.0669542</td></tr><tr><td class="sc-dnqmqq bdcvYW">29.75</td><td class="sc-dnqmqq bdcvYW">1.6</td><td class="sc-dnqmqq bdcvYW">2.0688850</td><td class="sc-dnqmqq bdcvYW">-0.4688850</td></tr><tr><td class="sc-dnqmqq bdcvYW">190</td><td class="sc-dnqmqq bdcvYW">1.7</td><td class="sc-dnqmqq bdcvYW">1.2311150</td><td class="sc-dnqmqq bdcvYW">0.4688850</td></tr></tbody></table>`); //Your HTML content goes here
    // pdf.save('test.pdf');

    api(MINMAX_DISCRETE_URL,  {
      method: 'POST',
      body: JSON.stringify({
        x_vals: xPoints,
        y_vals: yPoints,
        deg,
        pinnedPoints: pinnedPoints.map(point => +point)
      })
    }).then(res => {
        this.props.loader.hideLoader();
        // const endTime = Date.now();

        this.setState({
          data: toArr(res)
          // message: 'Затрачений час: ' + (endTime - startTime) / 1000 + ' c.'
        });
      })
      .catch(({status, errPromise}) => {
        errPromise.then(err => {
          toast(err.message);
          this.props.loader.hideLoader();
        })
      });
  }
  render() {
    return (
      <div>
        <ToastContainer hideProgressBar={true} />
        {
          demo
            ? !this.state.data ? <FormDiscrete onCalcClick={this.clickCalcHandler} pinPoints={true} /> : null
            : <FormDiscrete onCalcClick={this.clickCalcHandler} pinPoints={true} />
        }
        {this.state.data ? (
          <IterationListDiscreteMinmax arr={this.state.data} demo={demo} />
        ) : null}
      </div>
    );
  }
}

export default MinmaxDiscrete;
