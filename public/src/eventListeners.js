var board = document.getElementById('whiteboard')

var whiteboard = new Whiteboard(board.getContext('2d'));
var whiteboardID = document.location.href.split('/').reverse()[0];
var socket = io();
var postitDiv = document.getElementById('postit');
var postitObject = new Postit();
var postitNumber = 0;

var clear = document.getElementById('clear-whiteboard')
var undo = document.getElementById('undo')
var postit = document.getElementById('sticky0')
var user = document.getElementById('user').innerHTML;

function loadStrokes() {
  $.get('/loadstroke', { whiteboardID: whiteboardID }).done(function(data) {
    whiteboard.clear();
    data.forEach(function(stroke) {
      whiteboard.redraw(stroke)
    })
  })
}

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

clear.addEventListener('click', function() {
  socket.emit('clear-whiteboard', whiteboardID);
})

socket.on('clear-whiteboard', function(id){
  if (whiteboardID === id) {
    whiteboard.clear(id);
  }
});

$(function() {
  $('.postit').draggable()
});

postit.addEventListener("mouseup", function() {
  savePostit();
  socket.emit('postit', {
    postit: postitObject,
    whiteboardID: whiteboardID
  });
});

socket.on('postit', function(postitObject) {
  console.log(postitObject)
  var currentPostit = document.getElementById('sticky0')

  currentPostit.innerHTML = postitObject.postit.text
  currentPostit.style.position = "absolute"
  currentPostit.style.left = postitObject.postit.positionX + 'px'
  currentPostit.style.top = postitObject.postit.positionY + 'px'
});

postit.addEventListener('input', function() {
  savePostit();
})

function savePostit() {
  postitObject.text = document.getElementById('sticky0').innerHTML;
  var position = $('#sticky0').position()
  postitObject.updatePosition(position.left, position.top);
}

// document.getElementById('new-postit').addEventListener('click', function() {
//   $("#postit-container").append("<div class='draggable postit' id='sticky" + postitNumber + "'></div>")
//   $('.draggable').draggable()
//   eval("var sticky" + postitNumber + "= new Postit()");
//   $('#sticky' + postitNumber).data(sticky0);
//   postitNumber++
// })

// User login display logic - should start thinking about extracting sections out
// of here into separate files.
$('#signup-button').click( function() {
  $('.form-background').fadeIn();
  $('#signup-form').fadeIn();
})

$('#login-button').click( function() {
  $('.form-background').fadeIn();
  $('#login-form').fadeIn();
})

$('#logout-button').click( function(action) {
  $.get('/logout')
  location.reload();
})

$('.form-container').click( function(action) {
  action.stopPropagation();
})

$('.form-background').click( function() {
  $('.form-background').fadeOut();
  $('.form').fadeOut();
})
