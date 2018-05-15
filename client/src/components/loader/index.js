import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import styles from './loader.scss';

const Loader = ({ active }) => {
  return (
    <div class={active ? 'loader-wrapper' : 'hidden'}>
      <CircularProgress size={150} thickness={10} />
    </div>
  );
};

export default Loader;
