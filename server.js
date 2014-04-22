/**
 * Module dependencies
 */

var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

/**
 * Create the routes
 */

app.get("/", function(request, response) {
    response.sendfile(__dirname + "/index.html");
});


/**
 * Listen
 */

server.listen(3000);


/**
 * Socket.IO stuff
 */

var messages = [];

io.sockets.on('connection', function (socket) {
    socket.emit('initialize', messages);

    socket.on('chat', function (msg) {
        var data = {
            msg: msg
          , timestamp: new Date() 
        };

        messages.push(data);

        // clear excess messages
        if (messages.length > 50) {
            messages.shift();
        }

        io.sockets.emit(data);
    });

    socket.on('login', function (name) {
        socket.username = name;
        socket.broadcast.emit('user-connect', name);
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('user-disconnect', socket.username);
    });
});

