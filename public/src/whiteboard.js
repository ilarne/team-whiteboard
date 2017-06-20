'use strict';

function Whiteboard(context) {
  this.context = context;
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

Whiteboard.prototype.startDrawing = function(e, board) {
  this.painting = true;
  this.addClick(e.pageX - board.offsetLeft, e.pageY - board.offsetTop, false);
  this.redraw();
}

Whiteboard.prototype.stopDrawing = function() {
  this.painting = false;
}

Whiteboard.prototype.keepDrawing = function(e, board) {
  if (this.painting) {
    this.addClick(e.pageX - board.offsetLeft, e.pageY - board.offsetTop, true);
    this.redraw();
  }
}

Whiteboard.prototype.redraw = function() {
  this.context.lineJoin = "round";
  this.context.lineWidth = 5;

  for (var i=0; i < this.clickX.length; i++) {
    this.context.beginPath();

    if (this.clickDrag[i] && i) {
      this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
    } else {
      this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
    }

    this.context.lineTo(this.clickX[i], this.clickY[i]);
    this.context.closePath();
    this.context.strokeStyle = this.colour;
    this.context.stroke();
  }
}

Whiteboard.prototype.drawUpdate = function(values) {
  this.clickX = values[0]
  this.clickY = values[1]
  this.clickDrag = values[2]

  this.redraw();
}

Whiteboard.prototype.storedValue = function() {
  return [this.clickX, this.clickY, this.clickDrag];
}

module.exports = Whiteboard;
