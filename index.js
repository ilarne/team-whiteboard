const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const session = require('client-sessions')
const flash = require('connect-flash');
const bcrypt = require('bcrypt-nodejs');
const db = require('./dbConfig.js')
const User = db.User;
const Stroke = db.Stroke;
const Postit = db.Postit;
const UserWhiteboardRelationship = db.UserWhiteboardRelationship;
const randomstring = require("randomstring");

app.use(session({
  cookieName: 'session',
  secret: 'super-secret'
}))

app.use(flash());

var bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

app.engine('.html', require('ejs').renderFile);

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.redirect('/board/home')
})

function viewHomepage(req, res) {
  res.render(__dirname + '/whiteboard.html', {
    currentUser: req.session.user.username,
    message: req.flash('info')
  })
}

app.get('/welcome', function(req, res) {
  res.render('index.html', {
    message: req.flash('info')
  })
})

app.get('/board/home', function(req, res) {
  if (req.session.user) {
    viewHomepage(req, res)
  } else {
    res.redirect('/welcome')
  }
})

app.get('/board/:board', function(req, res) {
  if (req.session.user) {
    viewHomepage(req, res)
  } else {
    res.redirect('/welcome')
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
      req.flash('info', 'Sorry, those login details are invalid. Please try again!')
      res.redirect('/')
    } else {
      var result = bcrypt.compareSync(password, user.password);
      if (result == true) {
        req.session.user = user
        res.redirect('/');
      } else {
        req.flash('info', 'Sorry, that password is not right. Please try again!')
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
      req.flash('info', 'Username or email already exists')
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
      req.flash('info', 'Welcome to your board!')
      res.redirect('/board/' + randomstring.generate(7));
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

app.post('/addboard', function(req, res) {
  UserWhiteboardRelationship.find({ $and:
    [{ userID: req.session.user.username },
    { whiteboardID: req.body.whiteboardID }]
  }).then( function(existingFavourite) {
    if (existingFavourite[0]) {
      res.send()
    } else {
      var relationship = new UserWhiteboardRelationship({
        whiteboardID: req.body.whiteboardID,
        userID: req.session.user.username
      })
      relationship.save();
      res.send();
    }
  })
})

app.post('/search', function(req, res) {
  res.redirect('/board/' + req.body.search);
})

app.get('/loadstroke', function(req, res) {
  var whiteboardID = req.query.whiteboardID
  Stroke.find({ whiteboardID: whiteboardID }, function(e, data){} ).then( function(data) {
    res.send(data)
  })
})

app.get('/clear-whiteboard', function(req, res) {
  Stroke.remove({ whiteboardID: req.query.board }, function(){} ).then( function() {
    res.send('Strokes cleared!')
  })
  Postit.remove({ whiteboardID: req.query.board }, function(){}).then( function() {
    res.send('Postits cleared!')
  })
});

app.get('/loadRelationships', function(req, res) {
  var userID = req.query.userID
  UserWhiteboardRelationship.find({ userID: userID }, function(e, data){} ).then( function(data) {
    res.send(data);
  })
})

app.get('/clearBoards', function(req, res) {
  UserWhiteboardRelationship.remove({ userID: req.query.userID }, function(){} ).then( function() {
    res.send('Favourites cleared!')
  })
})

app.get('/undo', function(req, res) {
  var userID = req.query.userID
  Stroke.findOneAndRemove(Stroke.findOne({userID: userID }).sort({_id:-1})).then( function(stroke) {
    res.send()
  })
})

app.get('/loadpostit', function(req, res) {
  Postit.find({ whiteboardID: req.query.whiteboardID }, function(e, data){} ).then( function(data) {
    res.send(data);
  })
})

app.post('/createorupdatepostit', function(req, res) {
  Postit.findOne({ postitid: req.body.postitid }).then( function(postit) {
    if (!postit) {
      Postit.create({
        postitid: req.body.postitid,
        text: req.body.text,
        positionX: req.body.positionX,
        positionY: req.body.positionY,
        whiteboardID: req.body.whiteboardID,
        postitclass: req.body.postitClass
      })
    } else {
        postit.text = req.body.text,
        postit.positionX = req.body.positionX,
        postit.positionY = req.body.positionY,
        postit.save();
      }
    }).then( function(data) {
    res.send();
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

io.on('connection', function(socket){
  socket.on('postit', function(postit){
    io.emit('postit', postit);
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
