var board = document.getElementById('whiteboard')

var whiteboard = new Whiteboard(board.getContext('2d'));
var whiteboardID = document.location.href.split('/').reverse()[0];
var socket = io();

// post-its
// var postitDiv = document.getElementById('postit');
// var postitObject = new Postit();
// var postitNumber = 0;
// post-its


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
  loadPostits();
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






// post-its

var pad = document.getElementById('pad');

pad.addEventListener('click', function() {
  var id = 'postit' + +new Date();
  createPostit(id)
  savePostit(id);
  $(function() {
    $('#' + id).draggable()
  });
})
//
// postitIds.forEach(function(id) {
//   var postit = document.getElementById(id)
//   postit.addEventListener('mousemove', function() {
//     savePostit(id)
//   })
// })

function savePostit(divID) {
  var postitObject = new Postit();
  postitObject.postitID = divID
  postitObject.text = document.getElementById(divID).innerHTML;
  var position = $('#' + divID).position()
  postitObject.updatePosition(position.left, position.top);
  postitObject.saveToDB();
}

function loadPostits() {
  $.get('/loadpostit', { whiteboardID: whiteboardID } ).done(function(data) {
    data.forEach(function(postit) {
      createPostit(postit.postitid);
      var currentPostit = document.getElementById(postit.postitid);
      currentPostit.innerHTML = postit.text
      currentPostit.style.position = 'absolute'
      currentPostit.style.left = postit.positionX + 'px'
      currentPostit.style.top = postit.positionY + 'px'
    })
  })
}

function createPostit(postitId) {
  var $newPostit = $('<div>', { id: postitId, 'class': 'postit', 'contenteditable': 'true'});
  $("#pad").append($newPostit);
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





// post-its


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
