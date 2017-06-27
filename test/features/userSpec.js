process.env.NODE_ENV = 'test';

import { Selector } from 'testcafe';
const db = require('../../dbConfig.js')

db.User.remove({}, function(){}) // Empty test database of users before start

fixture `Page renders successfully`
    .page('http://localhost:3000/board/home');

  test('Page title displays correctly', async time => {
    await time
    .expect(Selector('title').innerText).eql('Team Whiteboard App');
  });

  test('Colour palette displays the correct colours', async time => {
    await time
    .expect(Selector('#red').getStyleProperty('background-color')).eql('rgb(255, 0, 0)')
    .expect(Selector('#black').getStyleProperty('background-color')).eql('rgb(0, 0, 0)')
    .expect(Selector('#blue').getStyleProperty('background-color')).eql('rgb(0, 0, 255)')
    .expect(Selector('#yellow').getStyleProperty('background-color')).eql('rgb(255, 255, 0)')
    .expect(Selector('#green').getStyleProperty('background-color')).eql('rgb(0, 204, 0)')
    .expect(Selector('#orange').getStyleProperty('background-color')).eql('rgb(255, 153, 0)')
    .expect(Selector('#purple').getStyleProperty('background-color')).eql('rgb(102, 0, 153)')
    .expect(Selector('#rubber').getStyleProperty('background-color')).eql('rgb(255, 255, 255)')
  });

  test('Login form does not display by default', async time => {
    await time
    .expect(Selector('#login-form').getStyleProperty('display')).eql('none')
  })

  test('Login form displays after clicking to log in', async time => {
    await time
    .click('#login-button')
    .expect(Selector('#login-form').getStyleProperty('display')).eql('block')
  })

  test('Sign up form does not display by default', async time => {
    await time
    .expect(Selector('#signup-form').getStyleProperty('display')).eql('none')
  })

  test('Signup form displays after clicking to sign up', async time => {
    await time
    .click('#signup-button')
    .expect(Selector('#signup-form').getStyleProperty('display')).eql('block')
  })

fixture `Signing up`
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

  test('Cannot sign up with an existing username', async time => {
    await time
      .click('#signup-button')
      .typeText('#signup-name', 'Jack Smith')
      .typeText('#signup-username', 'JSmith')
      .typeText('#signup-email', 'jack@gmail.com')
      .typeText('#signup-password', '123')
      .click('#create-account')
      .expect(Selector('#user').innerText).eql('');
  });

  test('Cannot sign up with an existing email', async time => {
    await time
      .click('#signup-button')
      .typeText('#signup-name', 'Jack Smith')
      .typeText('#signup-username', 'Jack_Smith_1')
      .typeText('#signup-email', 'smith@gmail.com')
      .typeText('#signup-password', '123')
      .click('#create-account')
      .expect(Selector('#user').innerText).eql('');
  });

fixture `Logging in`
    .page('http://localhost:3000/board/home');

  test('Cannot log into a non-existent account', async time => {
    await time
    .click('#login-button')
    .typeText('#login-username', 'fakeAccount')
    .typeText('#login-password', 'fakePassword')
    .click('#login-submit')
    .expect(Selector('#user').innerText).eql('');
  });

  test('Can log in to an existing account', async time => {
    await time
      .click('#login-button')
      .typeText('#login-username', 'JSmith')
      .typeText('#login-password', '123')
      .click('#login-submit')
      .expect(Selector('#user').innerText).eql('JSmith');
  });


  test('Cannot log in with a bad password', async time => {
    await time
      .click('#login-button')
      .typeText('#login-username', 'JSmith')
      .typeText('#login-password', 'badPassword')
      .click('#login-submit')
      .expect(Selector('#user').innerText).eql('');
  });

  test('Cannot log in with a non-existent username', async time => {
    await time
      .click('#login-button')
      .typeText('#login-username', 'Fake')
      .typeText('#login-password', '123')
      .click('#login-submit')
      .expect(Selector('#user').innerText).eql('');
  });

  test('Can log out successfully', async time => {
    await time
      .click('#login-button')
      .typeText('#login-username', 'JSmith')
      .typeText('#login-password', '123')
      .click('#login-submit')
      .click('#logout-button')
      .expect(Selector('#user').innerText).eql('');
  });
