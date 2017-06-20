const express = require('express');
var router = express.Router();
const app = express();
var mongoose = require('mongoose');
var mongo = require('mongodb');

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

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})

module.exports = currentBoard;
