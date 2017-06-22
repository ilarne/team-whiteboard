describe('Stroke', function() {
  var stroke;

  beforeEach(function() {
    stroke = new Stroke();
  })

  describe('Initialisation', function(){
    it('starts with empty clickX array', function() {
      expect(stroke.clickX).empty;
    })

    it('starts with empty clickY array', function() {
      expect(stroke.clickY).empty;
    })

    it('starts with empty clickDrag array', function() {
      expect(stroke.clickDrag).empty;
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

    it('records whether it is a dragged click', function() {
      stroke.addClick(1, 2, true);
      expect(stroke.clickDrag[0]).equal(true);
    })
  })
})
