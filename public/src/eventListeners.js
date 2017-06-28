var board = document.getElementById('whiteboard')

var whiteboard = new Whiteboard(board.getContext('2d'));
var whiteboardID = document.location.href.split('/').reverse()[0];
var socket = io();

var clear = document.getElementById('clear-whiteboard')
var undo = document.getElementById('undo')
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

document.addEventListener('DOMContentLoaded', function() {
  board.addEventListener("mousemove", function() {
    socket.emit('paint', {
      stroke: whiteboard.currentStroke,
      whiteboardID: whiteboardID
    });
  });
  board.addEventListener('mousedown', function() {
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

document.addEventListener('DOMContentLoaded', function() {
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

// When the user refreshes the page, the postits matching
// the relevant whiteboardIDs are created
document.addEventListener('DOMContentLoaded', function() {
  loadPostits();
})

// When user clicks the pad, a postit with a unique id
// is created and saved to the DB
var pad = document.getElementById('pad');

pad.addEventListener('mousedown', function() {
  var id = 'postit' + +new Date();
  createPostit(id);
  savePostit(id);
})

// The newly created postits (either in session on on load)
// save their text and co-ords when clicked
$(document.body).on('click mousemove mouseup input', '.postit', function() {
  savePostit(this.id);
  var position = $('#' + this.id).position()
  socket.emit('postit', {
    postitid: this.id,
    text: document.getElementById(this.id).value,
    positionX: position.left,
    positionY: position.top,
    whiteboardID: whiteboardID
  });
})

socket.on('postit', function(p) {
  if (whiteboardID === p.whiteboardID) {
    if (document.getElementById(p.postitid) !== null) {
      postit = document.getElementById(p.postitid)
      postit.value = p.text
      postit.style.left = p.positionX + 'px'
      postit.style.top = p.positionY + 'px'
    }
  }
});

// createPostit creates postit divs using the id passed to it
// either in session (brand new) on on page load (from DB)
function createPostit(postitId, x, y, text) {
  var text = text || '';
  var $newPostit = $('<textarea>', {
    id: postitId,
    'class': 'postit',
    'contenteditable': 'true',
    'style': 'left: ' + x + 'px; top: ' + y + 'px;'
  });
  $($newPostit).prependTo(document.body).draggable({
    cursor: "move",
    scroll: false,
    cancel: "text",
    containment: "parent"
  });
  document.getElementById(postitId).value = text
}

// savePostit saves a postit's text and co-ords to the relevant
// postitObject, as either passed to it or created from scratch
function savePostit(divID) {
  var position = $('#' + divID).position()
  $.post('/createorupdatepostit', {
    postitid: divID,
    text: document.getElementById(divID).value,
    positionX: position.left,
    positionY: position.top,
    whiteboardID: whiteboardID
  })
}

// loadPostits gets the postits that match the current board's
// whiteboardID, creates and fills the corresponding divs on page load
function loadPostits() {
  $.get('/loadpostit', { whiteboardID: whiteboardID }).done(function(data) {
    data.forEach(function(p) {
      if (document.getElementById(p.postitid) === null) {
        createPostit(p.postitid, p.positionX, p.positionY, p.text)
      }
    })
  })
}

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
