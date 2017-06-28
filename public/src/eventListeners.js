var board = document.getElementById('whiteboard');
var whiteboard = new Whiteboard(board.getContext('2d'));
var whiteboardID = document.location.href.split('/').reverse()[0];
var socket = io();
var clear = document.getElementById('clear-whiteboard')
var undo = document.getElementById('undo')
var user = document.getElementById('user').innerHTML;
var menu = document.getElementById('menu-button')
var addBoard = document.getElementById('add-board')
var clearBoards = document.getElementById('clear-boards')
var favourites = document.getElementById('favourites')
var search = document.getElementById('searchButton')

function loadStrokes() {
  $.get('/loadstroke', { whiteboardID: whiteboardID }).done(function(data) {
    whiteboard.clear();
    data.forEach(function(stroke) {
      whiteboard.redraw(stroke)
    })
  })
}

function loadRelationships() {
  $.get('/loadRelationships', { userID: user }).done(function(data) {
    favourites.innerHTML = '';
    data.forEach(function(link) {
      $('#favourites').append(
        $(`<div class="wrap">${link.whiteboardID}<iframe class="frame" style="pointer-events: none;" src="/board/${link.whiteboardID}"></iframe></div>`)
      )
    })
  })
}

$('#favourites').on('click', '.wrap', function() {
  document.location.href = $(this).children().attr('src')
})


menu.addEventListener('click', function() {
  loadRelationships();
})

addBoard.addEventListener('click', function() {
  $.post('/addboard', {
    whiteboardID: whiteboardID,
    userID: user
  })
  .done(function() {
    loadRelationships();
  })
})

clearBoards.addEventListener('click', function() {
  $.get('/clearboards', { userID: user })
  loadRelationships();
})

board.addEventListener('mousedown', function(element) {
  if (user) {
    whiteboard.startDrawing(element, board);
  }
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
  $.get('/undo', {userID: user}).done(function() {
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
