function Stroke(colour = '#000000', font = 5) {
  this.clickX = []
  this.clickY = []
  this.colour = colour;
  this.fontSize = font;
}

Stroke.prototype.addClick = function(x, y) {
  this.clickX.push(x)
  this.clickY.push(y)
}

module.exports = Stroke;
