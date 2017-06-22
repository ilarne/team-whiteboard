function Stroke(colour = '#000000', font = 5) {
  this.clickX = []
  this.clickY = []
  this.clickDrag = []
  this.colour = colour;
  this.fontSize = font;
}

Stroke.prototype.addClick = function(x, y, drag) {
  this.clickX.push(x)
  this.clickY.push(y)
  this.clickDrag.push(drag)
}

module.exports = Stroke;
