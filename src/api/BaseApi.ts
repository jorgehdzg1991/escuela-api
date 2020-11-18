import { Express } from 'express';

export default class BaseApi {
  protected app: Express;

  constructor(app: Express) {
    this.app = app;
    this.initializeRoutes();
  }

  // eslint-disable-next-line class-methods-use-this
  initializeRoutes(): void {
    throw new Error('Method not implemented. Please use a proper subclass.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static mount(app: Express): BaseApi {
    throw new Error('Method not implemented. Please use a proper subclass.');
  }
}
