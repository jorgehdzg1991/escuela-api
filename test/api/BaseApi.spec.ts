import expect from 'expect';
import BaseApi from '../../src/api/BaseApi';
import app from '../../src/app';

describe('BaseApi tests', () => {
  it('should throw if constructor called', () => {
    expect(() => new BaseApi(app)).toThrow(
      'Method not implemented. Please use a proper subclass.'
    );
  });

  it('should throw if mounted', () => {
    expect(() => BaseApi.mount(app)).toThrow(
      'Method not implemented. Please use a proper subclass.'
    );
  });
});
