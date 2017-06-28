const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const session = require('client-sessions');
const flash = require('connect-flash');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const db = require('./config/database.js');
const User = db.User;
const Stroke = db.Stroke;
const Postit = db.Postit;
const UserWhiteboardRelationship = db.UserWhiteboardRelationship;

app.use(session({
  cookieName: 'session',
  secret: 'super-secret'
}))

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('.html', require('ejs').renderFile);
app.use(express.static('public'));

require('./sockets.js')(io);
require('./routes/account.js')(app, User);
require('./routes/strokes.js')(app, Stroke);
require('./routes/postits.js')(app, Postit);
require('./routes/boards.js')(app, UserWhiteboardRelationship, Stroke, Postit);

app.get('/', function(req, res) {
  res.redirect('/board/home')
})

app.get('/welcome', function(req, res) {
  res.render('index.html', {
    message: req.flash('info')
  })
})

http.listen(port, function() {
  console.log('Get Onbord!')
})
