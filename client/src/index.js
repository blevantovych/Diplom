import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'mobx-react';
import main from './stores/main';
import loader from './stores/loader';

import Routes from './routes';

const app = document.getElementById('app');
ReactDOM.render(
  <Provider main={main} loader={loader}>
    <Routes />
  </Provider>,
  app
);
