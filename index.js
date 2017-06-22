const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const mongo = require('mongodb');

var Schema = mongoose.Schema;
mongoose.connect('localhost:27017/whiteboardDB')
var db = mongoose.connection;

var strokeSchema = new Schema({
  clickX: Array,
  clickY: Array,
  clickDrag: Array,
})

var Stroke = mongoose.model('Stroke', strokeSchema);
var currentStroke = new Stroke;

var bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

db.on('error', console.error.bind(console, 'connection error:'));

app.engine('.html', require('ejs').renderFile);

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.render(__dirname + '/whiteboard.html')
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

http.listen(port, function() {
  console.log('Whiteboard App listening on port 3000!')
})
