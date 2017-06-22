const expect = chai.expect;

describe('Canvas draws to page', function() {
  var whiteboard;

  beforeEach(function() {
    whiteboard = new Whiteboard(document.getElementById('whiteboard').getContext('2d'));
  })

  it('adds a click to the whiteboard', function() {
    // draw stuff
    whiteboard.context.beginPath();
    whiteboard.context.lineWidth = 2;
    whiteboard.context.strokeStyle = '#FF0000';
    whiteboard.context.moveTo(0, 0);
    whiteboard.context.lineTo(100, 100);
    whiteboard.context.closePath();
    whiteboard.context.stroke();

    // return an md5 hash of the instruction stack
    var hash = whiteboard.context.hash();

    // compare hash
    expect(hash).equal('f22495ed1ec685a8a0c8ed3190ba3d65');

    // clear the stack
    whiteboard.context.clear();
  });

  it('redraw method draws based on user co-ordinates', function() {
    // Add clicks as if user clicked
    whiteboard.currentStroke = { clickX: [], clickY: [], clickDrag: [] }
    whiteboard.currentStroke.clickX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    whiteboard.currentStroke.clickY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    whiteboard.currentStroke.clickDrag = [false, true, true, true, true, true, true, true, true, false];

    // Call the draw function
    whiteboard.redraw();

    var hash = whiteboard.context.hash();
    expect(hash).equal('f3d47c6b75864dcc174089e89b4e76ce'); // test passes

    // clear the stack
    whiteboard.context.clear();
  });

  it('the canvas does not display any strokes if the current stroke is null', function() {
    whiteboard.redraw(null);
    var hash = whiteboard.context.hash();
    expect(hash).equal('f2e68f183ea7408a9482646352fb3290'); // test passes
  })
})
