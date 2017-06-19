'use strict';

function Whiteboard() {
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

module.exports = Whiteboard;
