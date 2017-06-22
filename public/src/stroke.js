function Stroke(colour = '#000000') {
  this.clickX = []
  this.clickY = []
  this.clickDrag = []
  this.colour = colour;
}

Stroke.prototype.addClick = function(x, y, drag) {
  this.clickX.push(x)
  this.clickY.push(y)
  this.clickDrag.push(drag)
}

module.exports = Stroke;
