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

  test('Sign-up prompt displays when not logged in', async time => {
    await time
    .expect(Selector('.user-message').innerText).eql('Sign up to Onbord!');
  });

  test('User name is recorded succesfully when signing in', async time => {
    await time
      .click('#signup-button')
      .typeText('#signup-name', 'John Smith')
      .typeText('#signup-username', 'JSmith')
      .typeText('#signup-email', 'smith@gmail.com')
      .typeText('#signup-password', '123')
      .click('#create-account')
      .expect(Selector('#user').innerText).eql('JSmith');
  });

  test('Page confirms that the user is signed in', async time => {
    await time
      .click('#signup-button')
      .typeText('#signup-name', 'Test User')
      .typeText('#signup-username', 'TestUser')
      .typeText('#signup-email', 'testuser@gmail.com')
      .typeText('#signup-password', '123')
      .click('#create-account')
      .expect(Selector('.user-message').innerText).eql('Logged in as TestUser');
  });

  test('Can log in to an existing account', async time => {
    await time
      .click('#login-button')
      .typeText('#login-username', 'JSmith')
      .typeText('#login-password', '123')
      .click('#login-submit')
      .expect(Selector('.user-message').innerText).eql('Logged in as JSmith');
  });
