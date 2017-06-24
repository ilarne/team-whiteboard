var board = document.getElementById('whiteboard')

var whiteboard = new Whiteboard(board.getContext('2d'));
var whiteboardID = document.location.href.split('/').reverse()[0];
var socket = io();

board.addEventListener('mousedown', function(element) {
  whiteboard.startDrawing(element, board);
})

board.addEventListener('mousemove', function(element) {
  whiteboard.keepDrawing(element, board);
})

board.addEventListener('mouseup', function(element) {
  whiteboard.stopDrawing();
})

board.addEventListener('mouseleave', function(element) {
  whiteboard.stopDrawing();
})

document.addEventListener("DOMContentLoaded", function() {
  board.addEventListener("mousemove", function() {
    socket.emit('paint', {
      stroke: whiteboard.currentStroke,
      whiteboardID: whiteboardID
    });
  });
  board.addEventListener("mousedown", function() {
    socket.emit('paint', {
      stroke: whiteboard.currentStroke,
      whiteboardID: whiteboardID
    });
  });
  socket.on('paint', function(strokeObject) {
    if (whiteboardID === strokeObject.whiteboardID) {
      whiteboard.redraw(strokeObject.stroke)
    }
  });
})

document.addEventListener("DOMContentLoaded", function() {
  $.get('/loadstroke', { whiteboardID: whiteboardID })
    .done(function(data) {
      data.forEach(function(stroke) {
        whiteboard.redraw(stroke)
      })
    })
})

var clearSection = document.getElementById('clear-whiteboard')

clearSection.addEventListener('click', function() {
  $.get('/clear-whiteboard', { board: whiteboardID })
    .done(function() {
      whiteboard.clear();
    })
})

clearSection.addEventListener('click', function() {
  socket.emit('clear-whiteboard', whiteboardID);
})
socket.on('clear-whiteboard', function(id){
  if (whiteboardID === id) {
    whiteboard.clear(id);
  }
});
