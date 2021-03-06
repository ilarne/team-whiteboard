process.env.NODE_ENV = 'test';

import { Selector } from 'testcafe';
const db = require('../../app/config/database.js')

db.Postit.remove({}, function(){}) // Empty test database of postits before start
db.User.remove({}, function(){}) // Empty test database of postits before start

fixture `Postit Creation`
    .page('http://localhost:3000/board/home');

  test('Page starts with no postits', async time => {
    await time
    .click('#signup-button')
    .typeText('#signup-username', 'JS')
    .typeText('#signup-email', 'js@gmail.com')
    .typeText('#signup-password', '123')
    .click('#create-account')
    .expect(Selector('.postit').count).eql(0)
  });

  test('User can create a new postit', async time => {
    await time
    .click('#login-button')
    .typeText('#login-username', 'JS')
    .typeText('#login-password', '123')
    .click('#login-submit')
    .click('#pad')
    .expect(Selector('.postit').count).eql(1)
  });

  test('User can enter text into a post it', async time => {
    await time
    .click('#login-button')
    .typeText('#login-username', 'JS')
    .typeText('#login-password', '123')
    .click('#login-submit')
    .drag('.postit', 180, 0, { offsetX: 20, offsetY: 0 })
    .typeText('.postit', 'Hello I am typing on a postit go team')
    .expect(Selector('.postit').value).eql('Hello I am typing on a postit go team')
  });

  test('User can create multiple postits', async time => {
    await time
    .click('#login-button')
    .typeText('#login-username', 'JS')
    .typeText('#login-password', '123')
    .click('#login-submit')
    .click('#pad')
    .click('#pad')
    .expect(Selector('.postit').count).eql(3)
  });
