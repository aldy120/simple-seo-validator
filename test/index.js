const assert = require('assert');
const simpleSeoValidator = require('../src');

describe('test test', () => {
  it('a simple test', () => {
    assert.equal(1 + 1, 2);
  });
  it('should return 200', () => {
    assert.equal(simpleSeoValidator(), 200);
  });
});
