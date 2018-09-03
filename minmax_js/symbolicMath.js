const math = require('mathjs')
const {changeAlternance} = require('./changeAlternance')

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

function getEquationsAndRightHandSide(degree, alternance) {
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

const degree = 3;
const start = 1;
const end = 10;
const precision = 0.001;
const func = 'sin(x) * x' // function entered by user

const alternance = buildInitialAlternance({start, end, degree})

let {equations, b} = getEquationsAndRightHandSide(degree, initialAlternance);

let [[errorOnIteration], ...coefficients] = math.lusolve(equations, b)


let {xOfMaxError, maxError} = max_error(func, coefficients, start, end)

function showIterationInfo({alternance, maxError, xOfMaxError, errorOnIteration, coefficients})  {
  console.log(`Alternance: ${alternance.map(a => a.toFixed(7)).join('  ')}`)
  console.log(`Error in alternance: ${alternance.map(errFunc).map(x => x.toFixed(7)).join('  ')}`)
  console.log(`Max error: ${maxError}`);
  console.log(`x of max error: ${xOfMaxError}`)
  console.log(`Error on iteration: ${errorOnIteration}`);
  console.log(`Coefficients: ${coefficients.map(c => c[0].toFixed(7)).join(' ')} \n`);
}

while(Math.abs(Math.abs(maxError) - Math.abs(errorOnIteration)) / Math.abs(errorOnIteration) > precision) {
  const errFunc = errorFuncFactory(func, coefficients);

  showIterationInfo({alternance, maxError, xOfMaxError, errorOnIteration, coefficients})

  alternance = changeAlternance({errFunc, alternance, xOfMaxError})
  
  const {equations, b} = getEquationsAndRightHandSide(degree, alternance);
  [[errorOnIteration], ...coefficients] = math.lusolve(equations, b);

  var temp = max_error(func, coefficients, start, end)

  xOfMaxError = temp.xOfMaxError;
  maxError = temp.maxError;

}

showIterationInfo({alternance, maxError, xOfMaxError, errorOnIteration, coefficients})
