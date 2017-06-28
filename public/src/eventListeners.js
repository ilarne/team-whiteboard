var board = document.getElementById('whiteboard');
board.width = window.innerWidth - 20;
board.height = window.innerHeight - 80;
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
var pad = document.getElementById('pad');

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

// loadPostits gets the postits that match the current board's
// whiteboardID, creates and fills the corresponding divs on page load
function loadPostits() {
  $.get('/loadpostit', { whiteboardID: whiteboardID }).done(function(data) {
    data.forEach(function(p) {
      // console.log(p.postitclass)
      if (document.getElementById(p.postitid) === null) {
        createPostit(p.postitid, p.positionX, p.positionY, p.text, p.postitclass)
      }
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
    loadPostits();
    socket.emit('undo', 'reverted changes');
  })
})

socket.on('undo', function(undo) {
  loadStrokes();
  loadPostits();
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
    whiteboardID: whiteboardID,
    postitclass: $('#' + this.id).attr('class')
  });
})

socket.on('postit', function(p) {
  if (whiteboardID === p.whiteboardID) {
    if (document.getElementById(p.postitid) !== null) {
      postit = document.getElementById(p.postitid)
      postit.value = p.text
      postit.style.left = p.positionX + 'px'
      postit.style.top = p.positionY + 'px'
      postit.className = p.postitclass
    } else {
      createPostit(p.postitid)
    }
  }
});

// createPostit creates postit divs using the id passed to it
// either in session (brand new) on on page load (from DB)
function createPostit(postitId, x, y, text, colour) {
  var text = text || '';
  var colours = ['yellow', 'pink', 'green', 'blue']
  var colour = colour || colours[Math.floor(Math.random()*colours.length)];

  var $newPostit = $('<textarea>', {
    id: postitId,
    'class': 'postit ' + colour,
    'contenteditable': 'true',
    'style': 'left: ' + x + 'px; top: ' + y + 'px;'
  });
  $($newPostit).prependTo(document.body).draggable({
    cursor: "move",
    scroll: false,
    cancel: "text",
    containment: "html"
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
    whiteboardID: whiteboardID,
    postitClass: $('#' + divID).attr('class')
  })
}
