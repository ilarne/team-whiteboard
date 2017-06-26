'use strict';

function Postit(postitNumber) {
  this.postitNumber = postitNumber
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

Postit.prototype.saveToDB = function() {
  $.post('/newpostit', {
    postitid: 0,
    text: this.text,
    positionX: this.positionX,
    positionY: this.positionY,
    whiteboardID: document.location.href.split('/').reverse()[0]
  })
}

module.exports = Postit;
