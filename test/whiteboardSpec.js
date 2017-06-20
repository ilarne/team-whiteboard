const chai = require('chai')
const expect = chai.expect;
const assert = chai.assert;
const Whiteboard = require('../public/src/whiteboard.js');

describe('Whiteboard', function() {
  var whiteboard;
  var fakeElement = {pageX: 3, pageY: 3};
  var fakeBoard = {offsetLeft: 2, offsetTop: 2};
  var fakeCanvas = {
    lineJoin: 'round', strokeStyle: 'black', lineWidth: 5,
    beginPath: () => {}, moveTo: () => {}, lineTo: () => {},
    closePath: () => {}, stroke: () => {}
  }

  beforeEach(function() {
    whiteboard = new Whiteboard(fakeCanvas);
  })

  describe('Initialisation', function() {
    it('has a context variable', function() {
      expect(whiteboard.context).equal(fakeCanvas);
    })

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
  })

  describe('#addClick', function() {
    it('adds clicks to the x-axis', function() {
      whiteboard.addClick(1);
      expect(whiteboard.clickX[0]).equal(1);
    })

    it('adds clicks to the y-axis', function() {
      whiteboard.addClick(1, 2);
      expect(whiteboard.clickY[0]).equal(2);
    })

    it('records whether it is a dragged click', function() {
      whiteboard.addClick(1, 2, true);
      expect(whiteboard.clickDrag[0]).equal(true);
    })
  })

  describe('#startDrawing', function() {
    it('sets the boolean value "painting" to true', function() {
      whiteboard.startDrawing(fakeElement, fakeBoard);
      expect(whiteboard.painting).equal(true);
    })
  })

  describe('#stopDrawing', function() {
    it('sets the boolean value from true to false with "painting"', function() {
      whiteboard.startDrawing(fakeElement, fakeBoard);
      whiteboard.stopDrawing();
      expect(whiteboard.painting).equal(false);
    })
  })
})
