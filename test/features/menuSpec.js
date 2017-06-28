process.env.NODE_ENV = 'test';

import { Selector, ClientFunction } from 'testcafe';
const db = require('../../dbConfig.js');
const getWindowLocation = ClientFunction(() => window.location);

db.Postit.remove({}, function(){}) // Empty test database of postits before start
db.User.remove({}, function(){}) // Empty test database of postits before start
db.UserWhiteboardRelationship.remove({}, function(){}) // Empty test database of postits before start

fixture `Menu`
    .page('http://localhost:3000/board/home');

    test('Search bar takes user to searched url', async time => {
      await time
      .click('#signup-button')
      .typeText('#signup-username', 'SH')
      .typeText('#signup-email', 'sh@gmail.com')
      .typeText('#signup-password', '123')
      .click('#create-account')
      .click('#menu-button')
      .typeText('#search-term', 'catsanddogs')
      .click('#submit-search')

      const location = await getWindowLocation()
      await time
      .expect(location.pathname).eql('/board/catsanddogs')
    });

    test('Menu starts with no favourite boards', async time => {
      await time

      .click('#login-button')
      .typeText('#login-username', 'SH')
      .typeText('#login-password', '123')
      .click('#login-submit')
      .click('#menu-button')
      .expect(Selector('.frame').count).eql(0)
    });

    test('"Add to Favourites" adds a board to the menu', async time => {
      await time

      .click('#login-button')
      .typeText('#login-username', 'SH')
      .typeText('#login-password', '123')
      .click('#login-submit')
      .click('#menu-button')
      .typeText('#search-term', 'catsanddogs')
      .click('#submit-search')
      .click('#menu-button')
      .click('#add-board')
      .expect(Selector('.frame').count).eql(1)
    });

    test('"Clear Boards" clears the boards from the favourite', async time => {
      await time

      .click('#login-button')
      .typeText('#login-username', 'SH')
      .typeText('#login-password', '123')
      .click('#login-submit')
      .click('#menu-button')
      .click('#clear-boards')
      .expect(Selector('.frame').count).eql(0)
    });
