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

range.addEventListener("mousemove", function () {
  var size = range.value;
  whiteboard.adjustFontSize(size)
  $('.range').attr('value', this.value);
  var styleElement = document.querySelector('#forslider')

  if (this.value > 24) {
    var size = 50 * (this.value / 130)
  } else if (this.value > 4) {
    var size = 10
  } else {
    var size = 8
  }
  styleElement.innerHTML = "input[type='range']::-webkit-slider-thumb { height: " + size + "px; width: " + size + "px; }";
});


$(function() {
  $( "#control-panel-container" ).draggable();
});
