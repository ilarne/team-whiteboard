'use strict';

function Whiteboard(context) {
  this.context = context;
  this.painting = false;
  this.colour = "#000000"
}

Whiteboard.prototype.startDrawing = function(e, board) {
  this.currentStroke = new Stroke();
  this.painting = true;
  this.currentStroke.addClick(e.pageX - board.offsetLeft, e.pageY - board.offsetTop, false);
  this.redraw();
}

Whiteboard.prototype.stopDrawing = function() {
  this.painting = false;
}

Whiteboard.prototype.keepDrawing = function(e, board) {
  if (this.painting) {
    this.currentStroke.addClick(e.pageX - board.offsetLeft, e.pageY - board.offsetTop, true);
    this.redraw();
  }
}

Whiteboard.prototype.redraw = function() {
  this.context.lineJoin = "round";
  this.context.lineWidth = 5;

  for (var i=0; i < this.currentStroke.clickX.length; i++) {
    this.context.beginPath();

    if (this.currentStroke.clickDrag[i] && i) {
      this.context.moveTo(this.currentStroke.clickX[i-1], this.currentStroke.clickY[i-1]);
    } else {
      this.context.moveTo(this.currentStroke.clickX[i]-1, this.currentStroke.clickY[i]);
    }

    this.context.lineTo(this.currentStroke.clickX[i], this.currentStroke.clickY[i]);
    this.context.closePath();
    this.context.strokeStyle = this.colour;
    this.context.stroke();
  }
}

Whiteboard.prototype.drawUpdate = function(values) {
  this.currentStroke.clickX = values[0]
  this.currentStroke.clickY = values[1]
  this.currentStroke.clickDrag = values[2]

  this.redraw();
}

module.exports = Whiteboard;
