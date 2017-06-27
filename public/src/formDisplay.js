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

$('#menu-button').click( function() {
  $('.form-background').fadeIn();
  $('#menu-container').fadeIn();
})

$('.form-container').click( function(action) {
  action.stopPropagation();
})

$('.form-background').click( function() {
  $('.form-background').fadeOut();
  $('.form').fadeOut();
})
