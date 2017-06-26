var board = document.getElementById('whiteboard')

var whiteboard = new Whiteboard(board.getContext('2d'));
var whiteboardID = document.location.href.split('/').reverse()[0];
var socket = io();
var postitDiv = document.getElementById('postit');
var postitObject = new Postit();
var postitNumber = 0;

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
  loadStrokes();
})

clear.addEventListener('click', function() {
  $.get('/clear-whiteboard', { board: whiteboardID })
    .done(function() {
      whiteboard.clear();
    })
})

undo.addEventListener('click', function() {
  $.get('/undo').done(function() {
    loadStrokes();
    socket.emit('undo', 'reverted changes');
  })
})

socket.on('undo', function(undo) {
  loadStrokes();
})

clear.addEventListener('click', function() {
  socket.emit('clear-whiteboard', 'cleared');
})

socket.on('clear-whiteboard', function(clear){
  whiteboard.clear(clear);
})

clear.addEventListener('click', function() {
  socket.emit('clear-whiteboard', whiteboardID);
})

socket.on('clear-whiteboard', function(id){
  if (whiteboardID === id) {
    whiteboard.clear(id);
  }
});

postitDiv.addEventListener('mouseup', function() {
  var position = $('#postit').position()
  postitObject.updatePosition(position.left, position.top);
})

document.getElementById('new-postit').addEventListener('click', function() {
  $("#postit-container").append("<div class='draggable postit' id='sticky" + postitNumber + "'></div>")
  $('.draggable').draggable()
  eval("var sticky" + postitNumber + "= new Postit()");
  $('#sticky' + postitNumber).data(sticky0);
  postitNumber++
})
