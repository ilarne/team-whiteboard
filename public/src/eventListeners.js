var board = document.getElementById('whiteboard')
var whiteboard = new Whiteboard(board.getContext('2d'));
var socket = io();

board.addEventListener('mousedown', function(element) {
  whiteboard.startDrawing(element, board);
})

board.addEventListener('mousemove', function(element) {
  whiteboard.keepDrawing(element, board);
})

board.addEventListener('mouseup', function(element) {
  $.post('/newstroke', {clickX: whiteboard.currentStroke.clickX,
                        clickY: whiteboard.currentStroke.clickY,
                        colour: whiteboard.currentStroke.colour,
                        fontSize: whiteboard.currentStroke.fontSize})

  whiteboard.stopDrawing();
})

board.addEventListener('mouseleave', function(element) {
  whiteboard.stopDrawing();
})

document.addEventListener("DOMContentLoaded", function() {
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

var clear = document.getElementById('clear-whiteboard')
var undo = document.getElementById('undo')

clear.addEventListener('click', function() {
  $.get('/clear-whiteboard')
    .done(function() {
      whiteboard.clear();
    })
})

undo.addEventListener('click', function() {
  $.get('/undo')
    .done(function(data) {
      whiteboard.clear();
      data.forEach(function(stroke) {
        whiteboard.redraw(stroke)
      })
    })
})

clear.addEventListener('click', function() {
  socket.emit('clear-whiteboard', 'cleared');
})
socket.on('clear-whiteboard', function(clear){
  whiteboard.clear(clear);
})
