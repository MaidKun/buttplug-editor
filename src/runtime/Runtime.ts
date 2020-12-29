export default class Runtime {
  protected startTime: number;
  protected time = 0;

  constructor() {
    this.startTime = this.getSystemTime();
  }

  reset() {
    this.startTime = this.getSystemTime();
  }

  tick() {
    this.time = this.getSystemTime() - this.startTime;
  }

  getTime() {
    return this.time;
  }

  getSystemTime() {
    return (new Date()).getTime() / 1000;
  }
}
