import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const Formula = ({ formula }) => <InlineMath math={formula} />;
export default Formula;
