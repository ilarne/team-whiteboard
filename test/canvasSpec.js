describe('User clicks canvas', function() {
  it('adds a click to the whiteboard', function() {
    var context = document.getElementById('whiteboard').getContext('2d');

    // draw stuff
    context.beginPath();
    context.strokeStyle = '#FF0000';
    context.moveTo(0, 0);
    context.lineTo(100, 100);
    context.closePath();
    context.stroke();

    // return a strict md5 hash of the instruction stack, i.e. "ae4a4d42eb0d3701ab31125bf2cb2ba8"
    var hash = context.hash();

    // example unit test assertion
    expect(context.hash()).toEqual('41453a786bf5ba63719aa82d0107b5eb'); // test passes

    // clear the stack
    context.clear();
  })
})
