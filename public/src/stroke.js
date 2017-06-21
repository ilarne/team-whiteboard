function Stroke() {
  this.clickX = []
  this.clickY = []
  this.clickDrag = []
}

Stroke.prototype.addClick = function(x, y, drag) {
  this.clickX.push(x)
  this.clickY.push(y)
  this.clickDrag.push(drag)
}

module.exports = Stroke
