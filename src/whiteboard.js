'use strict';

function Whiteboard() {
  // this.context = document.getElementById('whiteboard').getContext('2d');
  this.painting = false;
  this.clickX = new Array();
  this.clickY = new Array();
  this.clickDrag = new Array();
  this.colour = "#000000"
}

Whiteboard.prototype.addClick = function(x, y, drag) {
  this.clickX.push(x)
  this.clickY.push(y)
  this.clickDrag.push(drag)
}

Whiteboard.prototype.startDrawing = function() {
  this.painting = true;
}

Whiteboard.prototype.stopDrawing = function() {
  this.painting = false;
}

module.exports = Whiteboard;
