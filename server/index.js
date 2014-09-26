(function () {
    'use strict';
    var express = require('express');
    var compress = require('compression');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var now = require("performance-now")

    var port = 8080;
    app.use(compress());
    app.use('/', express.static('../client/'));
    http.listen(port, function () {
        console.log('Start server on port 8080');
    });

    var clients = {};
    io.on('connection', function (socket) {
        var userData = {
            socket: socket
        };
        clients[socket.id] = userData;
        socket.on('new player', function (data) {
            userData.name = data.name;
            console.log(data);
            socket.emit('player list', {

            });
        });
        var pingInterval = setInterval(function () {
            socket.emit('ping', now());
        }, 250);
        socket.on('pong', function (date) {
            userData.ping = now() - date;
        });
        socket.on('disconnect', function () {
            socket.broadcast.emit('bye player', {
                id: socket.id
            });
            clearInterval(pingInterval);
            delete clients[socket.id];
        });
        socket.on('position', function(data) {
            data.player = socket.id;
            socket.broadcast.emit('position', data);
        });
        socket.on('shot', function(shot) {
            shot.player = socket.id;
            socket.broadcast.emit('shot', shot);
        });
        socket.on('chat', function(message) {
            var mesData = {
                message: message,
                player: socket.id
            };
            socket.broadcast.emit('chat', mesData);
        });
    });
})();
