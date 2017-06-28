$(".colour-button").click(function() {
  whiteboard.changeColour(this.getAttribute('data-value'));
})

document.addEventListener("DOMContentLoaded", function () {
  var colours = document.querySelectorAll(".colour-button");
  var body = document.getElementsByTagName("body")[0];

  for (var i=0; i <= colours.length - 1; i++) {
    colours[i].style.backgroundColor = colours[i].getAttribute('data-value');
  }

  $('.colour-button').on('click', function() {
    var colour = $(this)[0]
    colour.style.backgroundColor = colour.getAttribute('data-value');
    body.style.cursor = 'url(/images/cursors/' + colour.id + 'marker.png), pointer';
  })
})

var range = document.getElementById("font");

range.addEventListener("change", function () {
  var size = range.value;
  whiteboard.adjustFontSize(size)
});

  $(function() {
    $( "#control-panel-container" ).draggable();
  });

  $(function() {
    $( ".user-info-container" ).draggable();
  });
