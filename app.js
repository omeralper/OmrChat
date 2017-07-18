/**
 * Created by omeralper on 7/12/2017.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/dist'));

app.get('/', function(request, response) {
  response.sendFile('dist/index.html');
});

app.listen(port, function() {
  console.log('Node app is running on port', port);
});


io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('client_newMessage', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('server_newMessage', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('client_addUser', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('server_login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('server_userJoined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('client_typing', function () {
    socket.broadcast.emit('server_typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('client_stopTyping', function () {
    socket.broadcast.emit('server_stopTyping', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('client_disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('server_userLeft', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
