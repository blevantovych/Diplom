import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';

const App = () => (
  <MuiThemeProvider>
    <Header />
  </MuiThemeProvider>
);

export default App;
