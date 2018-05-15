let formsStates = {
  minmax: {
    func: "ln(x)",
    deg: 5,
    start: 1,
    end: 3,
    precision: 0.01,
    points: 10
  },
  lssq: {
    func: "ln(x)",
    deg: 1,
    start: 1,
    end: 3,
    precision: 0.01,
    points: 10
  },
  lssq_discrete: {
    points: [{ x: 0, y: 0 }],
    deg: 1
  },
  comp: {
    func: "ln(x)",
    deg: 1,
    start: 1,
    end: 3,
    precision: 0.01,
    points: 10
  },
  minmax_discrete: {
    points: [{ x: 0, y: 0 }],
    deg: 1
  },
  compare_discrete: {
    points: [{ x: 0, y: 0 }],
    deg: 1
  }
};

export default formsStates;
