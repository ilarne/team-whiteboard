const expect = chai.expect;
const assert = chai.assert;

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

    it('starts painting as false', function() {
      expect(whiteboard.painting).equal(false);
    })

    it('starts with the colour black', function() {
      expect(whiteboard.colour).equal('#000000');
    })

    it('starts with an empty array of strokes', function() {
      expect(whiteboard.strokes).empty;
    });
  })

  describe('#startDrawing', function() {
    it('sets the boolean value "painting" to true', function() {
      whiteboard.startDrawing(fakeElement, fakeBoard);
      expect(whiteboard.painting).equal(true);
    })

    it('instansiates a new Stroke when called', function() {
      whiteboard.startDrawing(fakeElement, fakeBoard);
      expect(whiteboard.currentStroke.clickX[0]).equal(1);
    })
  })

  describe('#keepDrawing', function() {
    it('adds to currentStroke object', function() {
      whiteboard.startDrawing(fakeElement, fakeBoard);
      whiteboard.keepDrawing(fakeElement, fakeBoard);
      expect(whiteboard.currentStroke.clickX.length).equal(2);
    })
  })

  describe('#stopDrawing', function() {
    it('sets the boolean value from true to false with "painting"', function() {
      whiteboard.startDrawing(fakeElement, fakeBoard);
      whiteboard.stopDrawing();
      expect(whiteboard.painting).equal(false);
    })

    it('pushes a stroke object into the strokes array', function() {
      whiteboard.startDrawing(fakeElement, fakeBoard);
      whiteboard.stopDrawing();
      expect(whiteboard.strokes.length).equal(1)
    });
  })
})
