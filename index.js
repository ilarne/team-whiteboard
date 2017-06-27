const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const session = require('client-sessions')
const bcrypt = require('bcrypt-nodejs');
const db = require('./dbConfig.js')
const User = db.User;
const Stroke = db.Stroke;

app.use(session({
  cookieName: 'session',
  secret: 'super-secret'
}))

var bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

app.engine('.html', require('ejs').renderFile);

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.redirect('/board/home')
})

app.get('/board/:board', function(req, res) {
  if (req.session.user) {
    res.render(__dirname + '/whiteboard.html', {
      currentUser: req.session.user.username
    })
  } else {
    res.render(__dirname + '/whiteboard.html', {
      currentUser: null
    })
  }
})

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/')
})

app.post('/user/login', function(req, res) {
  var password = req.body.password;

  User.find({ username: req.body.username }, function(e, user) {
    user = user[0];
    if (user === undefined) {
      res.redirect('/')
    } else {
      var result = bcrypt.compareSync(password, user.password);
      if (result == true) {
        req.session.user = user
        res.redirect('/');
      } else {
        res.redirect('/');
      };
    }
  });
});

app.post('/user/new', function(req, res) {
  User.find(
    {$or:[{'username': req.body.username}, {'email': req.body.email }]}
  ).then( function(existingUser) {
    if (existingUser[0]) {
      res.redirect('/')
    } else {
      var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      var user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      req.session.user = user;
      user.save();
      res.redirect('/');
    }
  })
})

app.post('/newstroke', function(req, res) {
  var stroke = new Stroke({
    clickX: req.body.clickX,
    clickY: req.body.clickY,
    colour: req.body.colour,
    fontSize: req.body.fontSize,
    whiteboardID: req.body.whiteboardID,
    userID: req.session.user.username
  });
  stroke.save();
  res.send();
})

app.get('/loadstroke', function(req, res) {
  var whiteboardID = req.query.whiteboardID
  Stroke.find({ whiteboardID: whiteboardID }, function(e, data){} ).then( function(data) {
    res.send(data)
  })
})

app.get('/clear-whiteboard', function(req, res) {
  Stroke.remove({ whiteboardID: req.query.board }, function(){} ).then( function() {
    res.send('Whiteboard cleared!')
  })
});

app.get('/undo', function(req, res) {
  Stroke.findOneAndRemove(Stroke.findOne({userID: req.query.userID}).sort({_id:-1})).then( function(stroke) {
    res.send()
  })
})

io.on('connection', function(socket){
  socket.on('paint', function(msg){
    io.emit('paint', msg);
  })
})

io.on('connection', function(socket){
  socket.on('clear-whiteboard', function(clear){
    io.emit('clear-whiteboard', clear);
  })
})

io.on('connection', function(socket){
  socket.on('undo', function(undo){
    io.emit('undo', undo);
  })
})

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('connection name', function(user) {
    io.sockets.emit('new user', user.name + " has joined.")
  })
  socket.on('disconnect', function() {
    console.log('user disconnected');
  })
})

http.listen(port, function() {
  console.log('Whiteboard App listening on port 3000!')
})

function findStrokes(boardName) {
  Stroke.find({ whiteboardId: boardName }, function(e, data){
  } ).then( function(data) {
    res.send(data)
  })
}
