const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const mongo = require('mongodb');

const http = require('http').Server(app);
const io = require('socket.io')(http);

var Schema = mongoose.Schema;
mongoose.connect('localhost:27017/whiteboardDB')
var db = mongoose.connection;

var boardSchema = new Schema({
  clickX: Array,
  clickY: Array,
  clickDrag: Array,
})

var Board = mongoose.model('Board', boardSchema);
var currentBoard = new Board;

var bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

db.on('error', console.error.bind(console, 'connection error:'));

app.engine('.html', require('ejs').renderFile);

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/whiteboard.html')
})

io.on('connection', function(socket){
  socket.on('paint', function(msg){
    io.emit('paint', msg);
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

http.listen(3000, function() {
  console.log('Whiteboard App listening on port 3000!')
})
