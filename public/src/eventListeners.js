var board = document.getElementById('whiteboard')
var whiteboard = new Whiteboard(board.getContext('2d'));

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

document.addEventListener("DOMContentLoaded", function () {
  var socket = io();
  board.addEventListener("mousemove", function() {
    socket.emit('paint', whiteboard.storedValue());
  });
  socket.on('paint', function(thing) {
  whiteboard.drawUpdate(thing)
  });
});
