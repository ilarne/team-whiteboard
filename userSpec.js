import { Selector } from 'testcafe';
const config = require('./config.js').get(process.env.NODE_ENV);

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(config.database)
var db = mongoose.connection;

var userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String
})

var User = mongoose.model('User', userSchema)
User.remove({}, function(){})

fixture `Getting Started`
    .page('http://localhost:3000/board/home');

  test('User name is blank when not logged in', async time => {
    await time
    .expect(Selector('#user').innerText).eql('');
  });

  test('Logs in succesfully', async time => {
    await time
      .click('#signup-button')
      .typeText('#signup-name', 'bark')
      .typeText('#signup-username', 'bark')
      .typeText('#signup-email', 'bark@gmail.com')
      .typeText('#signup-password', 'bark')
      .click('#create-account')
      .expect(Selector('#user').innerText).eql('bark');
  });
