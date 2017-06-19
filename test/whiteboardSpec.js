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

  describe('Initialisation', function() {

    it('has an empty x-axis array of clicks', function() {
      expect(whiteboard.clickX).empty;
    })

    it('has an empty y-axis array of clicks', function() {
      expect(whiteboard.clickY).empty;
    })

    it('starts painting as false', function() {
      expect(whiteboard.painting).equal(false);
    })

    it('has an empty clickDrag array', function() {
      expect(whiteboard.clickDrag).empty;
    })

    it('starts with the colour black', function() {
      expect(whiteboard.colour).equal('#000000');
    })

  });
});
