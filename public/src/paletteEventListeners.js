$(".colour-button").click(function() {
  whiteboard.changeColour(this.getAttribute('data-value'));
})

document.addEventListener("DOMContentLoaded", function () {
  var colours = document.querySelectorAll(".colour-button");

  colours.forEach(function(colour) {
    colour.style.backgroundColor = colour.getAttribute('data-value');
  })
})
