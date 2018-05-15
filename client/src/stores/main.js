import { observable } from 'mobx';
// import

class Main {
  @observable history = [];
  @observable isMinmax = true;
  @observable isLssq = false;
  @observable loaderActive = false;

  @observable message = '';
  @observable data = [];
  @observable dataLS = null;
  @observable dataLS_discrete = null;
  @observable dataMinmax_discrete = [];
  @observable dataCompareMinmaxDiscrete = null;
  @observable dataCompareLssqDiscrete = null;
  // @observable viewId = 2; // I will use react router for this

  @observable
  lssq = {
    max_error: 0,
    x_of_max_error: 0,
    formula: '',
    error_plot: []
  };

  @observable
  minmax = {
    max_err: 0,
    x_of_max_err: 0,
    func_plot: [],
    pol_plot: [],
    polynom_latex: '',
    error_plot: []
  };
}

export default new Main();
