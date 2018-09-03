const changeAlternance = ({errFunc, previousAlternance, xOfMaxError}) => {
  const previousAlternanceWithXOfMaxError = [...previousAlternance, xOfMaxError];
  previousAlternanceWithXOfMaxError.sort((a, b) => a - b);
  
  const indexOfXOfMaxError = previousAlternanceWithXOfMaxError.indexOf(xOfMaxError);

  if (Math.sign(errFunc(xOfMaxError)) === Math.sign(errFunc(previousAlternanceWithXOfMaxError[indexOfXOfMaxError - 1]))) {
    previousAlternanceWithXOfMaxError.splice(indexOfXOfMaxError - 1, 1)
  } else {
    previousAlternanceWithXOfMaxError.splice(indexOfXOfMaxError + 1, 1)
  }

  return previousAlternanceWithXOfMaxError
}

const errFunc = Math.sin
const previousAlternance = [1, 2, 3, 4, 5, 10]
const xOfMaxError = 3.4;

// console.log(changeAlternance({errFunc, previousAlternance ,xOfMaxError}))


function isAlternance({alternance, errFunc}) {
  for (let i = 0; i < alternance.length - 1; i++) {
    if (Math.sign(errFunc(alternance[i])) === Math.sign(errFunc(alternance[i + 1])))
      return false;
  }
  return true;
}

console.log(isAlternance({alternance: [1, 4], errFunc: Math.sin}))

module.exports = {
  changeAlternance
}