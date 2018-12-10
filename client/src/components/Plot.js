import React from 'react';
import Plot from 'react-plotly.js';

const ResponsivePlot = ({layout, ...props}) => (
  <Plot
    {...props}
    useResizeHandler={true}
    style={{width: '100%', height: '100%'}}
    layout={{...layout, autosize: true}}
  />
)
    
export default ResponsivePlot;
