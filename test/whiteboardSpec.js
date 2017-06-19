const chai = require('chai')
const expect = chai.expect;
const Whiteboard = require('../src/whiteboard.js');

describe('Whiteboard', function() {
  var whiteboard;

  beforeEach(function() {
    whiteboard = new Whiteboard();
  })

  it('should be defined', function() {
    expect(Whiteboard).isDefined;
  })

  it('starts with an empty array of clicks', function() {
    expect(whiteboard.clickX).empty;
  })
})
