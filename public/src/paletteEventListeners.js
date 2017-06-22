$(".colour-button").click(function() {
  whiteboard.changeColour(this.getAttribute('data-value'));
})

document.addEventListener("DOMContentLoaded", function () {
  var colours = document.querySelectorAll(".colour-button");
  var body = document.getElementsByTagName("body")[0];

  colours.forEach(function(colour) {
    colour.style.backgroundColor = colour.getAttribute('data-value');
    colour.addEventListener('click', function() {
      body.style.cursor = 'url(/images/cursors/' + colour.id + 'marker.png), pointer';
    })
  })


})
