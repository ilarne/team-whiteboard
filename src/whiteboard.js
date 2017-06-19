'use strict';

function Whiteboard() {
  this.painting = false;
  this.clickX = new Array();
  this.clickY = new Array();
  this.clickDrag = new Array();
  this.colour = "#000000"
}

module.exports = Whiteboard;
