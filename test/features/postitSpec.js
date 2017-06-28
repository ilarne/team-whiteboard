process.env.NODE_ENV = 'test';

import { Selector } from 'testcafe';
const db = require('../../dbConfig.js')

db.Postit.remove({}, function(){}) // Empty test database of postits before start

fixture `Postit Creation`
    .page('http://localhost:3000/board/home');

  test('Page starts with no postits', async time => {
    await time
    .click('#login-button')
    .typeText('#login-username', 'JSmith')
    .typeText('#login-password', '123')
    .click('#login-submit')
    .expect(Selector('.postit').count).eql(0)
  });

  test('User can create a new postit', async time => {
    await time
    .click('#login-button')
    .typeText('#login-username', 'JSmith')
    .typeText('#login-password', '123')
    .click('#login-submit')
    .click('#pad')
    .expect(Selector('.postit').count).eql(1)
  });

  test('User can create multiple postits', async time => {
    await time
    .click('#login-button')
    .typeText('#login-username', 'JSmith')
    .typeText('#login-password', '123')
    .click('#login-submit')
    .click('#pad')
    .click('#pad')
    .expect(Selector('.postit').count).eql(3)
  });
