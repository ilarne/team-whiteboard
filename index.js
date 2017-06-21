const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/whiteboard.html')
})

io.on('connection', function(socket){
  socket.on('paint', function(msg){
    io.emit('paint', msg);
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('connection name', function(user){
    io.sockets.emit('new user', user.name + " has joined.")
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  })
})

http.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
