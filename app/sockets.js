module.exports = (io) => {
  io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('connection name', function(user) {
      io.sockets.emit('new user', user.name + " has joined.")
    })
    socket.on('disconnect', function() {
      console.log('user disconnected');
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
}
