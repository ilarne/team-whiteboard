const Browser = require('zombie');
const assert = require('assert');
const url = 'http://localhost:3000/';
const browser = new Browser();

before(function(done) {
  return browser.visit(url, done);
});

describe('Page displays correctly', function() {
  it('user has option of eight colours', function() {
    browser.assert.elements('.colour-button', 8);
  })

  it('Only the sign up message appears when not logged in', function() {
    browser.assert.elements('.user-message', 1);
  })

  it('displays the team title in the browser', function() {
    browser.assert.text('title', 'Team Whiteboard App');
  })

  it('colour buttons are appropriately coloured-in', function() {
    browser.assert.style('#red', 'background-color', 'rgb(255, 0, 0)');
    browser.assert.style('#black', 'background-color', 'rgb(0, 0, 0)');
    browser.assert.style('#blue', 'background-color', 'rgb(0, 0, 255)');
    browser.assert.style('#yellow', 'background-color', 'rgb(255, 255, 0)');
    browser.assert.style('#green', 'background-color', 'rgb(0, 204, 0)');
    browser.assert.style('#orange', 'background-color', 'rgb(255, 153, 0)');
    browser.assert.style('#purple', 'background-color', 'rgb(102, 0, 153)');
    browser.assert.style('#rubber', 'background-color', 'rgb(255, 255, 255)');
  })

  it('user name is empty when not logged in', function() {
    browser.assert.text('.user-message', 'Sign up to Onbord!');
  })

  it('user name is empty when not logged in', function() {
    browser.assert.text('#user', '');
  })
})

describe('User signs up', function() {
  before(function(done) {
    browser.pressButton('Sign up');
    browser
      .fill('name',    'turk')
      .fill('input[name="username"]', 'turk')
      .fill('input[name="email"]', 'turk@testtest.com')
      .fill('input[name="password"]', 'turk');
      return browser.pressButton('input[value="Submit"]', done);
  });

  it('should sign up successfully', function(done) {
    browser.assert.text('.user-message', 'Sign up to Onbord!');
    done();
  });
})
