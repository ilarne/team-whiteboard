function Stroke(colour, font) {
  this.clickX = []
  this.clickY = []
  this.colour = colour || '#000000';
  this.fontSize = font || 5;
}

Stroke.prototype.addClick = function(x, y) {
  this.clickX.push(x)
  this.clickY.push(y)
}
