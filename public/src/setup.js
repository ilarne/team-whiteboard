var board = document.getElementById('whiteboard');
var whiteboard = new Whiteboard(board.getContext('2d'));
var whiteboardID = document.location.href.split('/').reverse()[0];
var clear = document.getElementById('clear-whiteboard')
var undo = document.getElementById('undo')
var user = document.getElementById('user').innerHTML;
var menu = document.getElementById('menu-button')
var addBoard = document.getElementById('add-board')
var clearBoards = document.getElementById('clear-boards')
var favourites = document.getElementById('favourites')
var search = document.getElementById('searchButton')
var pad = document.getElementById('pad');

board.width = window.innerWidth - 20;
board.height = window.innerHeight - 20;

window.module = window.module || {}

// Helper functions

function fadeOutWelcomeMessage() {
  $("#welcome-message").fadeOut()
}

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
