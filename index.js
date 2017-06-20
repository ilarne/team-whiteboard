const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/whiteboard.html')
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
//
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
//
// io.on('connection', function(socket){
//   console.log('a user connected');
// });
//
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });
