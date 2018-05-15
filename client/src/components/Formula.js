// import MathJax from "react-mathjax";
import React from 'react';

export default function(props) {
  return (
    <div class="formula">
      {props.formula}
      {/* <MathJax.Context> */}
      {/* <MathJax.Node inline></MathJax.Node> */}
      {/* </MathJax.Context> */}
    </div>
  );
}
