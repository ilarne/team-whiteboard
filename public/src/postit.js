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

Postit.prototype.repost = function() {
  var currentPostit = document.getElementById('sticky0')

  currentPostit.style.position = "absolute"
  currentPostit.style.left = this.positionX
  currentPostit.style.top = this.positionY
}

module.exports = Postit;
