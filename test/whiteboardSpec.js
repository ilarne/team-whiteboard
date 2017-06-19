const chai = require('chai')
const expect = chai.expect;
const Whiteboard = require('../src/whiteboard.js');

describe('Whiteboard', function() {
  it('should be defined', function() {
    expect(Whiteboard).isDefined;
  })
})
