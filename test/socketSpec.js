var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var boardUser1 = {'name':'Izzy'}
var boardUser2 = {'name':'Tim'}

describe('Board user connections', function() {
  it('broadcasts a new user to all clients', function(done) {
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data) {
      client1.emit('connection name', boardUser1);

      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data) {
        client2.emit('connection name', boardUser2);
      })

      client2.on('new user', function(usersName){
        usersName.should.equal(boardUser2.name + " has joined.");
        client2.disconnect();
      })
    })

    var numUsers = 0;
    client1.on('new user', function(usersName){
      numUsers += 1;

      if(numUsers === 2){
        usersName.should.equal(boardUser2.name + " has joined.");
        client1.disconnect();
        done();
      }
    })
  })
})
