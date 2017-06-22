var board = document.getElementById('whiteboard')
var whiteboard = new Whiteboard(board.getContext('2d'));

board.addEventListener('mousedown', function(element) {
  whiteboard.startDrawing(element, board);
})

board.addEventListener('mousemove', function(element) {
  whiteboard.keepDrawing(element, board);
})

board.addEventListener('mouseup', function(element) {
  $.post('/newstroke', {clickX: whiteboard.currentStroke.clickX, clickY: whiteboard.currentStroke.clickY, clickDrag: whiteboard.currentStroke.clickDrag})

  whiteboard.stopDrawing();
})

board.addEventListener('mouseleave', function(element) {
  whiteboard.stopDrawing();
})

document.addEventListener("DOMContentLoaded", function() {
  var socket = io();
  board.addEventListener("mousemove", function() {
    socket.emit('paint', whiteboard.currentStroke);
  });
  board.addEventListener("mousedown", function() {
    socket.emit('paint', whiteboard.currentStroke);
  });
  socket.on('paint', function(stroke) {
    whiteboard.redraw(stroke)
  });
})

document.addEventListener("DOMContentLoaded", function() {
  $.get('/loadstroke')
    .done(function(data) {
      data.forEach(function(stroke) {
        whiteboard.redraw(stroke)
      })
    })
})
