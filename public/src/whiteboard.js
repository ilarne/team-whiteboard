'use strict';

function Whiteboard(context) {
  this.context = context;
  this.painting = false;
  this.colour = "#000000"
  this.strokes = [];
  this.currentStroke = null;
}

Whiteboard.prototype.startDrawing = function(e, board) {
  this.currentStroke = new Stroke(this.colour);
  this.painting = true;
  this.currentStroke.addClick(e.pageX - board.offsetLeft, e.pageY - board.offsetTop, false);
  this.redraw();
}

Whiteboard.prototype.changeColour = function(colour) {
  this.colour = colour;
}

Whiteboard.prototype.stopDrawing = function() {
  this.painting = false;

  if (this.currentStroke) {
    this.strokes.push(this.currentStroke);
    this.currentStroke = null;
  }
}

Whiteboard.prototype.keepDrawing = function(e, board) {
  if (this.painting) {
    this.currentStroke.addClick(e.pageX - board.offsetLeft, e.pageY - board.offsetTop, true);
    this.redraw();
  }
}

Whiteboard.prototype.redraw = function(stroke) {
  var stroke = stroke || this.currentStroke;

  this.context.lineJoin = "round";
  this.context.lineWidth = 5;

  if (stroke !== null) {
    for (var i=0; i < stroke.clickX.length; i++) {
      this.context.beginPath();

      if (stroke.clickDrag[i] && i) {
        this.context.moveTo(stroke.clickX[i-1], stroke.clickY[i-1]);
      } else {
        this.context.moveTo(stroke.clickX[i]-1, stroke.clickY[i]);
      }

      this.context.lineTo(stroke.clickX[i], stroke.clickY[i]);
      this.context.closePath();
      this.context.strokeStyle = this.colour;
      this.context.stroke();
    }
  }
}

module.exports = Whiteboard;
