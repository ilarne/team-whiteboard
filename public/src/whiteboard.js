'use strict';

function Whiteboard(context) {
  this.context = context;
  this.painting = false;
  this.colour = "#000000";
  this.fontSize = 5;
  this.currentStroke = null;
}

Whiteboard.prototype.startDrawing = function(e, board) {
  this.currentStroke = new Stroke(this.colour, this.fontSize);
  this.painting = true;
  this.currentStroke.addClick(e.pageX - board.offsetLeft, e.pageY - board.offsetTop);
  this.redraw();
}

Whiteboard.prototype.changeColour = function(colour) {
  this.colour = colour;
}

Whiteboard.prototype.adjustFontSize = function(size) {
  this.fontSize = size;
}

Whiteboard.prototype.stopDrawing = function() {
  this.painting = false;

  if (this.currentStroke) {
    this.saveStroke();
    this.currentStroke = null;
  }
}

Whiteboard.prototype.keepDrawing = function(e, board) {
  if (this.painting) {

    if (this.currentStroke.clickX.length >= 200) {
      this.saveStroke();
      this.redraw();
      this.currentStroke = new Stroke(this.colour, this.fontSize);
    }

    this.currentStroke.addClick(e.pageX - board.offsetLeft, e.pageY - board.offsetTop);
    this.redraw();
  }
}

Whiteboard.prototype.clear = function() {
  this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
}

Whiteboard.prototype.saveStroke = function() {
  $.post('/newstroke', {
    clickX: this.currentStroke.clickX,
    clickY: this.currentStroke.clickY,
    colour: this.currentStroke.colour,
    fontSize: this.currentStroke.fontSize,
    whiteboardID: document.location.href.split('/').reverse()[0],
    userID: document.getElementById('user').innerHTML
  })
}

Whiteboard.prototype.addBoard = function() {
  $.post('/addboard', {
    whiteboardID: document.location.href.split('/').reverse()[0],
    userID: document.getElementById('user').innerHTML
  })
}

Whiteboard.prototype.redraw = function(stroke) {
  var stroke = stroke || this.currentStroke;

  this.context.lineJoin = "round";

  if (stroke !== null) {

    this.context.lineWidth = stroke.fontSize;

    for (var i=0; i < stroke.clickX.length; i++) {
      this.context.beginPath();

      if (stroke.clickX.length === 1) {
        this.context.moveTo(stroke.clickX[i]-1, stroke.clickY[i]);
      } else {
        this.context.moveTo(stroke.clickX[i-1], stroke.clickY[i-1]);
      }

      this.context.lineTo(stroke.clickX[i], stroke.clickY[i]);
      this.context.closePath();
      this.context.strokeStyle = stroke.colour;
      this.context.stroke();
    }
  }
}

module.exports = Whiteboard;
