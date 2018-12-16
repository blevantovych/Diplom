import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

class ErrorMessage extends Component {
  render() {
    return (
      <div>
        <Snackbar
          open={this.props.open}
          message={this.props.message || 'Something went wrong!'}
          autoHideDuration={this.props.duration || 4000}
          onRequestClose={this.props.handleClose}
        />
      </div>
    );
  }
}

export default ErrorMessage;
