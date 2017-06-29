setTimeout(fadeOutWelcomeMessage, 5000);

setTimeout(loadPostits(), 2000);

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
  loadStrokes();
})

clear.addEventListener('click', function() {
  $.get('/clear-whiteboard', { board: whiteboardID })
    .done(function() {
      whiteboard.clear();
    })
})

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
