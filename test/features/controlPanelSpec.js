process.env.NODE_ENV = 'test';

import { Selector } from 'testcafe';
const db = require('../../app/config/database.js')

db.Postit.remove({}, function(){})
db.User.remove({}, function(){})
db.Stroke.remove({}, function(){})

fixture `Control Panel`
    .page('http://localhost:3000/board/home');

  test('Colour palette displays the correct colours', async time => {
    await time
    .expect(Selector('#red').getStyleProperty('background-color')).eql('rgb(241, 140, 127)')
    .expect(Selector('#black').getStyleProperty('background-color')).eql('rgb(20, 20, 20)')
    .expect(Selector('#blue').getStyleProperty('background-color')).eql('rgb(121, 188, 234)')
    .expect(Selector('#yellow').getStyleProperty('background-color')).eql('rgb(255, 253, 152)')
    .expect(Selector('#green').getStyleProperty('background-color')).eql('rgb(112, 223, 162)')
    .expect(Selector('#orange').getStyleProperty('background-color')).eql('rgb(249, 192, 92)')
    .expect(Selector('#purple').getStyleProperty('background-color')).eql('rgb(192, 146, 211)')
    .expect(Selector('#rubber').getStyleProperty('background-color')).eql('rgb(255, 255, 255)')
  });

  test('Pen can draw on the whiteboard', async time => {
    await time

    .click('#signup-button')
    .typeText('#signup-username', 'TH')
    .typeText('#signup-email', 'th@gmail.com')
    .typeText('#signup-password', '123')
    .click('#create-account')

    .click('#whiteboard', {
      offsetX: 200,
      offsetY: 200
    })

    var stroke = await db.Stroke.find({})
    await time
    .expect(stroke.length).eql(1)
  });

  test('"Undo" clears the whiteboard of the last stroke', async time => {
    await time

    .click('#login-button')
    .typeText('#login-username', 'TH')
    .typeText('#login-password', '123')
    .click('#login-submit')

    .click('#whiteboard', {
      offsetX: 300,
      offsetY: 200
    })

    .click('#undo')

    var stroke = await db.Stroke.find({})
    await time
    .expect(stroke.length).eql(1)

    .click('#undo')

    var stroke = await db.Stroke.find({})
    await time
    .expect(stroke.length).eql(0)
  });

  test('"Clear" clears the whiteboard of all strokes', async time => {
    await time

    .click('#login-button')
    .typeText('#login-username', 'TH')
    .typeText('#login-password', '123')
    .click('#login-submit')

    .click('#whiteboard', {
      offsetX: 300,
      offsetY: 200,
      speed: 0.1
    })

    .click('#whiteboard', {
      offsetX: 400,
      offsetY: 200,
      speed: 0.1
    })

    .click('#clear-whiteboard')

    var stroke = await db.Stroke.find({})
    await time
    .expect(stroke.length).eql(0)
  });
