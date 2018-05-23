import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';
import Loader from './loader';

const App = () => (
  <MuiThemeProvider>
    <div>
      <Header />
      <Loader />
    </div>
  </MuiThemeProvider>
);

export default App;
