describe('Stroke', function() {
  var stroke;
  var greenStroke;

  beforeEach(function() {
    stroke = new Stroke();
    bigGreenStroke = new Stroke('#00FF00', 50);
  })

  describe('Initialisation', function(){
    it('starts with empty clickX array', function() {
      expect(stroke.clickX).empty;
    })

    it('starts with empty clickY array', function() {
      expect(stroke.clickY).empty;
    })

    it('has a default starting colour', function() {
      expect(stroke.colour).equal('#000000')
    })

    it('can receive a new starting colour', function() {
      expect(bigGreenStroke.colour).equal('#00FF00')
    })

    it('has a default starting font size', function() {
      expect(stroke.fontSize).equal(5)
    })

    it('can receive a new starting font size', function() {
      expect(bigGreenStroke.fontSize).equal(50)
    })
  })

  describe('#addClick', function() {
    it('adds clicks to the x-axis', function() {
      stroke.addClick(1);
      expect(stroke.clickX[0]).equal(1);
    })

    it('adds clicks to the y-axis', function() {
      stroke.addClick(1, 2);
      expect(stroke.clickY[0]).equal(2);
    })
  })
})
