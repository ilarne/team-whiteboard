const socket = io();

function loadStrokes() {
  $.get('/loadstroke', { whiteboardID: whiteboardID }).done(function(data) {
    whiteboard.clear();
    data.forEach(function(stroke) {
      whiteboard.redraw(stroke)
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
