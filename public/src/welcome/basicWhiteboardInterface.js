var board = document.getElementById('whiteboard');
var whiteboard = new Whiteboard(board.getContext('2d'))
var clear = document.getElementById('clear-whiteboard')
var undo = document.getElementById('undo')
board.width = window.innerWidth - 20;
board.height = window.innerHeight - 20;

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

clear.addEventListener('click', function() {
  whiteboard.clear();
})

// undo.addEventListener('click', function() {
//   $.get('/undo', {userID: user}).done(function() {
//     loadStrokes();
//     socket.emit('undo', 'reverted changes');
//   })
// })
