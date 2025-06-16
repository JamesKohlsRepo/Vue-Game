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

let lobbyConnections = [];
let games = new Map();
let playerGameMap = new Map();

const Game = require('./game/gameLogic');

io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('player-joined', ({ name }) => {
        lobbyConnections.push({ id: socket.id, name });
        console.log('Player joined lobby:', name);
        io.emit('lobby-player-list', lobbyConnections);
    });

    socket.on('start-game', () => {
        const gameId = uuidv4();
        const game = new Game(gameId);

        lobbyConnections.forEach(p => {
          playerGameMap.set(p.id, gameId);
          const sock = io.sockets.sockets.get(p.id);
          if (sock) sock.join(gameId);
        });

        lobbyConnections.forEach(p => game.addPlayer(p));
        games.set(gameId, game);

        io.to(gameId).emit('game-started', { gameId });

        io.to(gameId).emit('game-state', game.getGameState());  // this part is critical!

        lobbyConnections = [];
        io.emit('lobby-player-list', lobbyConnections);
    });

    socket.on('player-left-lobby', () => {
        lobbyConnections = lobbyConnections.filter(p => p.id !== socket.id);
        io.emit('lobby-player-list', lobbyConnections);
    });

    socket.on('player-left-game', ({ gameId }) => {
        const game = games.get(gameId);
        if (game) {
            game.removePlayer(socket.id);
            io.emit('game-state', game.getGameState());
        }
    });

    // handle a draw request from a player
    socket.on('draw-card', () => {
      const gameId = playerGameMap.get(socket.id);
      const game = games.get(gameId);
      if (!game) return;
      const result = game.drawCard();
      // broadcast updated state to that game room
      io.to(gameId).emit('game-state', game.getGameState());
      // send the updated hand back to only the drawing player
      io.to(socket.id).emit('hand-update', result.hand);
    });

    // handle end-turn request from a player
    socket.on('end-turn', () => {
      const gameId = playerGameMap.get(socket.id);
      const game = games.get(gameId);
      if (!game) return;
      game.endTurn();
      io.to(gameId).emit('game-state', game.getGameState());
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        const wasInLobby = lobbyConnections.some(p => p.id === socket.id);
        lobbyConnections = lobbyConnections.filter(p => p.id !== socket.id);
        if (wasInLobby) {
            io.emit('lobby-player-list', lobbyConnections);
        }

        for (const [gameId, game] of games.entries()) {
            const found = game.players.find(p => p.id === socket.id);
            if (found) {
                game.removePlayer(socket.id);
                io.emit('game-state', game.getGameState());
                console.log(`Player removed from game ${gameId}`);
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});