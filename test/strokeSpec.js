const chai = require('chai')
const expect = chai.expect;
const assert = chai.assert;
const Stroke = require('../public/src/stroke.js');

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

})
