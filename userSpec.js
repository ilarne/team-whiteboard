process.env.NODE_ENV = 'test';

import { Selector } from 'testcafe';
const db = require('./dbConfig.js')

db.User.remove({}, function(){}) // Empty test database of users before start

fixture `User Account Management`
    .page('http://localhost:3000/board/home');

  test('User name is blank when not logged in', async time => {
    await time
    .expect(Selector('#user').innerText).eql('');
  });

  test('User name is recorded succesfully', async time => {
    await time
      .click('#signup-button')
      .typeText('#signup-name', 'bark')
      .typeText('#signup-username', 'bark')
      .typeText('#signup-email', 'bark@gmail.com')
      .typeText('#signup-password', 'bark')
      .click('#create-account')
      .expect(Selector('#user').innerText).eql('bark');
  });
