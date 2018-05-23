import { observable, action } from 'mobx';

class Loader {
  @observable active = false;

  @action.bound
  hideLoader() {
    this.active = false;
  }

  @action.bound
  showLoader() {
    this.active = true;
  }
}

const loader = new Loader();
window.loader = loader;

export default loader;
