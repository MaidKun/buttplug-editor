export default class AsyncCache<T> {
  private callback: () => Promise<T>;
  
  private isExecuting = false;
  private hasResult = false;

  private result?: T;
  private error?: Error;

  private resolve: Array<(value: T) => unknown> = [];
  private reject: Array<(error: Error) => unknown> = [];

  constructor(callback: () => Promise<T>) {
    this.callback = callback;
  }

  invoke() {
    if (this.isExecuting) {
      return this.listenToCurrentCall();
    }

    return this.reload();
  }

  reload() {
    this.hasResult = false;
    this.isExecuting = true;

    return new Promise((resolve, reject) => {
      this.resolve.push(resolve);
      this.reject.push(reject);

      this.callback().then(result => {
        this.setResult(result);
      }).catch(err => {
        this.setError(err);
      })
    })
  }

  setResult(result: T) {
    this.hasResult = true;
    this.isExecuting = false;
    this.error = undefined;

    const resolve = this.resolve;
    this.resolve = [];
    this.reject = [];

    for (const call of resolve) {
      call(result);
    }
  }

  setError(result: Error) {
    this.hasResult = true;
    this.isExecuting = false;

    const reject = this.reject;
    this.resolve = [];
    this.reject = [];

    for (const call of reject) {
      call(result);
    }
  }

  private listenToCurrentCall() {
    return new Promise((resolve, reject) => {
      if (!this.hasResult) {
        this.resolve.push(resolve);
        this.reject.push(reject);
        return;
      }

      if (this.error) {
        reject(this.error);
      } else {
        resolve(this.result);
      }
    })
  }
}