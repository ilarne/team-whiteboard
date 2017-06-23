const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const config = require('./config.js').get(process.env.NODE_ENV);

const mongoose = require('mongoose');
const mongo = require('mongodb');

var Schema = mongoose.Schema;
mongoose.connect(config.database)
var db = mongoose.connection;

var strokeSchema = new Schema({
  clickX: Array,
  clickY: Array,
  colour: String,
  fontSize: Number,
  whiteboardID: String,
})

var Stroke = mongoose.model('Stroke', strokeSchema);

var bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

app.engine('.html', require('ejs').renderFile);

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.redirect('/board/home')
})

app.get('/board/:board', function(req, res) {
  var board = req.params.board
  res.render(__dirname + '/whiteboard.html')
})

app.post('/newstroke', function(req, res) {
  var stroke = new Stroke({
    clickX: req.body.clickX,
    clickY: req.body.clickY,
    colour: req.body.colour,
    fontSize: req.body.fontSize,
    whiteboardID: req.body.whiteboardID
  });
  stroke.save();
  res.send();

  // we should try to send events every 10 seconds or when the array gets to X length

})

app.get('/loadstroke', function(req, res) {
  var whiteboardID = req.query.whiteboardID
  Stroke.find({ whiteboardID: whiteboardID }, function(e, data){} ).then( function(data) {
    res.send(data)
  })
})

app.get('/clear-whiteboard', function(req, res) {
  Stroke.remove({}, function(){} ).then( function() {
    res.send('Whiteboard cleared!')
  })
});

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
