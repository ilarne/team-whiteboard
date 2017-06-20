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
    expect(whiteboard.context.hash()).equal('f22495ed1ec685a8a0c8ed3190ba3d65');

    // clear the stack
    whiteboard.context.clear();
  });

  it('redraw method draws based on user co-ordinates', function() {
    // Add clicks as if user clicked
    whiteboard.clickX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    whiteboard.clickY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    whiteboard.clickDrag = [false, true, true, true, true, true, true, true, true, false];

    // Call the draw function
    whiteboard.redraw();

    var hash = whiteboard.context.hash();
    expect(whiteboard.context.hash()).equal('3a8de8b8452500846a82fe7a6583accb'); // test passes

    // clear the stack
    whiteboard.context.clear();
  });
})
