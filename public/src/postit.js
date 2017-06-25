'use strict';

function Postit() {
  this.text = "New sticky"
  this.positionX = 0
  this.positionY = 0
}

Postit.prototype.changeText = function(text) {
  this.text = text
}

Postit.prototype.updatePosition = function(x, y) {
  this.positionX = x
  this.positionY = y
}

$( function() {
  $( "#postit" ).draggable();
});
