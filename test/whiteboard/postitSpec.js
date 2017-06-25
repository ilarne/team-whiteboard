describe('Postit', function() {
  beforeEach(function() {
    postit = new Postit();
  })

  describe('Initialisation', function() {
    it('starts with placeholder text', function() {
      expect(postit.text).equal('New sticky')
    })

    it('starts at X-coordinate 0', function() {
    expect(postit.positionX).equal(0)
    })

    it('starts at Y-coordinate 0', function() {
    expect(postit.positionY).equal(0)
    })
  })

  describe('#changeText', function() {
    it('allows you to change text', function() {
      postit.changeText('New text')
      expect(postit.text).equal('New text')
    })
  })

  describe('#updatePosition', function() {
    it('updates the X-coordinate', function() {
      postit.updatePosition(4, 3)
      expect(postit.positionX).equal(4)
    })

    it('updates the Y-coordinate', function() {
      postit.updatePosition(4, 5)
      expect(postit.positionY).equal(5)
    })
  })
})
