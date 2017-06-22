const Browser = require('zombie');
const assert = require('assert');
const url = 'http://localhost:3000/';
const browser = new Browser();

before(function(done){
  return browser.visit(url, done);
});
