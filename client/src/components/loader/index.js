import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './loader.scss';
import { observer, inject } from 'mobx-react';

const Loader = ({ loader }) => {
  return (
    <div class={loader.active ? 'loader-wrapper' : 'hidden'}>
      <CircularProgress size={150} thickness={10} />
    </div>
  );
};

export default inject('loader')(observer(Loader));
