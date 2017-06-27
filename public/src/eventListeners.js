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





var pad = document.getElementById('pad');

// When user clicks the pad, a postit with a unique id
// is created and saved to the DB
pad.addEventListener('click', function() {
  var id = 'postit' + +new Date();
  createPostit(id)
  savePostit(id);
  $(function() {
    $('#' + id).draggable()
  });
})

// When the user refreshes the page, the postits matching
// the relevant whiteboardIDs are created
document.addEventListener("DOMContentLoaded", function() {
  loadPostits();
})

// The newly created postits (either in session on on load)
// save their text and co-ords when clicked
$(document.body).on('click mouseup input', '.postit', function() {
  savePostit(this.id);
})

// createPostit creates postit divs using the id passed to it
// either in session (brand new) on on page load (from DB)
function createPostit(postitId) {
  var $newPostit = $('<div>', { id: postitId, 'class': 'postit', 'contenteditable': 'true'});
  $("#pad").append($newPostit);
}

// savePostit saves a postit's text and co-ords to the relevant
// postitObject, as either passed to it or created from scratch
function savePostit(divID) {
  var postitObject = new Postit();
  postitObject.postitID = divID
  postitObject.text = document.getElementById(divID).innerHTML;
  var position = $('#' + divID).position()
  postitObject.updatePosition(position.left, position.top);
  postitObject.saveToDB();
}

// loadPostits gets the postits that match the current board's
// whiteboardID, creates and fills the corresponding divs on page load
function loadPostits() {
  $.get('/loadpostit', { whiteboardID: whiteboardID }).done(function(data) {
    data.forEach(function(postit) {
      createPostit(postit.postitid);
      var currentPostit = document.getElementById(postit.postitid);
      currentPostit.innerHTML = postit.text
      currentPostit.style.position = 'absolute'
      currentPostit.style.left = postit.positionX + 'px'
      currentPostit.style.top = postit.positionY + 'px'
      $(function() {
        $('#' + postit.postitid).draggable()
      });
    })
  })
}

//
// var postits = document.querySelectorAll('postit');
// for (var i = 0; i < postits.length; i++) {
//   postits[i].addEventListener('mouseup', savePostit($(this).attr('id')))
// }

//
// $('postit').on('click', function() {
//   console.log('before')
//   savePostit($(this).attr('id'));
//   console.log('after')
//
// })

// $('body').on('click', 'a.postit', function() {
//   savePostit(this.id)
// })


// $(function(){
//   $('.postit').click( function() {
//     savePostit(this.id)
//   })
// })

// function displayPostit(postitArray) {
//   for (i = 0; i < postitArray.length; i++) {
//     var currentPostitId = 'postit' + postitArray[i]
//     var currentPostit = document.getElementById(currentPostit)
//
//     Postit.find({ postitid: currentPostitId }, function(e, data){} ).then( function(data) {
//       res.send(data)
//     })
//
//     currentPostit.innerHTML = data.text
//     currentPostit.style.position = "absolute"
//     currentPostit.style.left = data.positionX + 'px'
//     currentPostit.style.top = data.positionY + 'px'
//   }
// }

// socket.on('postit', function(postitObject) {
//   if (whiteboardID === postitObject.whiteboardID) {
//     displayPostit(postitObject);
//   }
// });
//
// postit.addEventListener('mousemove', function() {
//   savePostit();
//   socket.emit('postit', {
//     postit: postitObject,
//     whiteboardID: whiteboardID
//   });
// })


// postit.addEventListener('mouseup', function() {
//   savePostit();
//   socket.emit('postit', {
//     postit: postitObject,
//     whiteboardID: whiteboardID
//   });
// });
//
// postit.addEventListener('input', function() {
//   savePostit(this.id);
// })
//
// $('div').on('click', function() {
//   savePostit(this.id);
//   var postit = document.getElementById(this.id)
// });
//
//
//
//




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
