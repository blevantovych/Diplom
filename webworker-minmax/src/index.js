import math from 'mathjs'
import {changeAlternance} from './changeAlternance'

function buildInitialAlternance({start, end, degree}) {
  return new Array(degree + 2).fill(true).map((_, i) => start + (end - start) * i / (degree + 1)) 
}

function errorFuncFactory (func, coefficients) {
  return x => math.eval(func, {x}) - evaluate(coefficients, x)
}

function max_error (func, coefficients, start, end) {
  const includeEnd = true;
  const step = 0.001;
  const xValues = math.range(start, end, step, includeEnd)._data
  let xOfMaxError;
  let maxError = 0;

  const errorFunc = errorFuncFactory(func, coefficients)

  for (let x of xValues) {
    let error = errorFunc(x)
    if (Math.abs(error) > Math.abs(maxError)) {
      maxError = error
      xOfMaxError = x
    }
  }

  return {xOfMaxError, maxError}
}

function evaluate(coefficients, x) {
  // coefficients [a0, a1, a2, a3, a4, ...]
  // a0 + a1 * x**1 + a2 * x**2 + a3 * x**3 + ...
  let result = 0;
  for (let i = 0; i < coefficients.length; i++) {
    result += coefficients[i] * Math.pow(x, i);
  }
  return result;
}

function getEquationsAndRightHandSide(degree, alternance, func) {
  const equations = new Array(degree + 2).fill(true).map(() => [])
  const b = []
  for (let i = 0; i < degree + 2; i++) {
    equations[i].push(i % 2 ? -1 : 1)
    for (let j = 0; j <= degree; j++) {
      equations[i].push(-Math.pow(alternance[i], j).toFixed(4))
    }
    b.push(-+math.eval(func, {x: alternance[i]}).toFixed(4))
  }
  return {equations, b}
}


// function showIterationInfo({alternance, maxError, xOfMaxError, errorOnIteration, coefficients})  {
//   console.log(`Alternance: ${alternance.map(a => a.toFixed(7)).join('  ')}`)
//   console.log(`Error in alternance: ${alternance.map(errFunc).map(x => x.toFixed(7)).join('  ')}`)
//   console.log(`Max error: ${maxError}`);
//   console.log(`x of max error: ${xOfMaxError}`)
//   console.log(`Error on iteration: ${errorOnIteration}`);
//   console.log(`Coefficients: ${coefficients.map(c => c[0].toFixed(7)).join(' ')} \n`);
// }

function main({degree = 3, start = 1, end = 10, precision = 0.001, func = 'sin(x) * x'}) {
  let alternance = buildInitialAlternance({start, end, degree})

  let {equations, b} = getEquationsAndRightHandSide(degree, alternance, func);
  
  let [[errorOnIteration], ...coefficients] = math.lusolve(equations, b)
  
  
  let {xOfMaxError, maxError} = max_error(func, coefficients, start, end)
  
  postMessage(JSON.stringify({alternance, maxError, xOfMaxError, errorOnIteration, coefficients}, null, 2))

  while(Math.abs(Math.abs(maxError) - Math.abs(errorOnIteration)) / Math.abs(errorOnIteration) > precision) {
    const errFunc = errorFuncFactory(func, coefficients);
    // showIterationInfo({alternance, maxError, xOfMaxError, errorOnIteration, coefficients})
    postMessage(JSON.stringify({alternance, maxError, xOfMaxError, errorOnIteration, coefficients}, null, 2))

    alternance = changeAlternance({errFunc, previousAlternance: alternance, xOfMaxError})
    
    const {equations, b} = getEquationsAndRightHandSide(degree, alternance, func);
    [[errorOnIteration], ...coefficients] = math.lusolve(equations, b);
  
    var temp = max_error(func, coefficients, start, end)
  
    xOfMaxError = temp.xOfMaxError;
    maxError = temp.maxError;
  }
  postMessage(JSON.stringify({alternance, maxError, xOfMaxError, errorOnIteration, coefficients}, null, 2))
  // postMessage(JSON.stringify({finished: true}))
  // showIterationInfo({alternance, maxError, xOfMaxError, errorOnIteration, coefficients})

}

// const degree = 3;
// const start = 1;
// const end = 10;
// const precision = 0.001;
// const func = 'sin(x) * x' // function entered by user


self.onmessage = function({data}) {
  main(data)
};