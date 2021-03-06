(function () {
    'use strict';
    var express = require('express');
    var compress = require('compression');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var now = require("performance-now");
    var staticCompressed = require('./serve-static-compressed');

    var port = process.env.PORT || 8080;
    app.use(compress());
    app.get('/', function(req, res) {
        res.redirect('/app/index.html');
    });
    app.use('/', staticCompressed(__dirname + '/../client/'));
    http.listen(port, function () {
        console.log('Start server on port ' + port);
    });

    var clients = {};
    io.on('connection', function (socket) {
        var userData = {
            socket: socket,
            spaceship: null
        };
        clients[socket.id] = userData;
        socket.on('new player', function (data) {
            userData.name = data.name;
            console.log('New player: ' + data.name);
            var playerList = [];
            var spawnData = [];
            for(var index in clients) {
                var client = clients[index];
                playerList.push({
                    id: index,
                    name: client.name
                });
                if(client.spaceship) {
                    spawnData.push({
                        player: index,
                        maxVelocity: client.spaceship.maxVelocity
                    });
                }
            }
            socket.emit('set id', socket.id);
            socket.emit('player list',  playerList);
            for(var i=0; i<spawnData.length;++i) {
                socket.emit('spawn', spawnData[i]);
            }
            socket.broadcast.emit('new player', {
                name: data.name,
                id: socket.id
            });
        });
        var pingInterval = setInterval(function () {
            socket.emit('ping', now());
        }, 2500);
        socket.on('pong', function (date) {
            userData.ping = now() - date;
        });
        socket.on('disconnect', function () {
            console.log('Bye player ' + userData.name);
            io.emit('bye player', socket.id);
            clearInterval(pingInterval);
            delete clients[socket.id];
        });
        socket.on('position', function(data) {
            var message = {
                player: socket.id,
                data: data
            };
            socket.broadcast.emit('position', message);
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
            io.emit('chat', mesData);
        });
        socket.on('spawn', function(data) {
            userData.spaceship = {
                position: null,
                maxVelocity: data.maxVelocity
            };
            data.player = socket.id;
            socket.broadcast.emit('spawn', data);
        });
        socket.on('die', function(data) {
            userData.spaceship = null;
            socket.broadcast.emit('die', socket.id);
        });
        socket.on('shipDamage', function(data) {
            clients[data.player].socket.emit('shipDamage', {
                emitter: socket.id,
                damage: data.damage,
                target: data.player
            });
        });
    });
})();
