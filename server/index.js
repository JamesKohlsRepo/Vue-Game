const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

let players = [];

const Game = require('./game/gameLogic');
const game = new Game();

// game.addPlayer(), game.startGame() in  socket handlers

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('player-joined', ({ name }) => {
    players.push({ id: socket.id, name });
    io.emit('player-list', players);
  });

  socket.on('player-left', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('player-list', players);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    players = players.filter(p => p.id !== socket.id);
    io.emit('player-list', players);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});