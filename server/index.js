const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

let connections = [];
let games = new Map(); // key: gameId, value: Game instance


const Game = require('./game/gameLogic');


// game.addPlayer(), game.startGame() in  socket handlers

io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('player-joined', ({ name }) => {
        connections.push({ id: socket.id, name });
        io.emit('player-list', connections);
    });

    socket.on('start-game', () => {
        const gameId = uuidv4(); 
        const game = new Game(gameId);
        connections.forEach(p => game.addPlayer(p));
        games.set(gameId, game);

        // tell clients which game they're in
        io.emit('game-started', { gameId });
    });

    socket.on('player-left', () => {
        connections = connections.filter(p => p.id !== socket.id);
        io.emit('player-list', connections);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        connections = connections.filter(p => p.id !== socket.id);
        io.emit('player-list', connections);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});