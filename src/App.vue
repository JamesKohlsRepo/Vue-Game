<template>
  <div id="app">
    <HomePage v-if="!joined" @join="handleJoin" />
    <LobbyPage v-else-if="joined && !gameStarted" :lobbyPlayerList="lobbyPlayerList" :currentPlayerId="currentPlayerId"
      @leave="handleLeave" @start="handleStart" />
    <GamePage v-else
      :playerList="gamePlayerList"
      :currentPlayerId="currentPlayerId"
      :gameId="gameId"
      :currentTurnId="currentTurnId"
      :hand="hand"
      @leave="handleLeave"
      @draw-card="handleDraw"
      @end-turn="handleEndTurn"
    />
  </div>
</template>

<script>
import socket from './socket.js';
import HomePage from './components/HomePage.vue';
import LobbyPage from './components/LobbyPage.vue';
import GamePage from './components/GamePage.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    LobbyPage,
    GamePage,
  },
  data() {
    return {
      joined: false,
      gameStarted: false,
      gameId: '',
      currentPlayerId: '',
      lobbyPlayerList: [],
      gamePlayerList: [],
      currentTurnId: '',
      hand: [],
    };
  },
  methods: {
    handleJoin(name) {
      this.joined = true;
      this.currentPlayerId = socket.id;
      console.log('Current Player ID:', this.currentPlayerId);
      socket.emit('player-joined', { name });
    },
    handleLeave() {
      if (this.gameStarted) {
        socket.emit('player-left-game', { gameId: this.gameId });
        this.gameStarted = false;
      } else {
        socket.emit('player-left-lobby');
      }
      this.joined = false;
      this.currentPlayerId = '';
      this.lobbyPlayerList = [];
      this.gamePlayerList = [];
      this.gameId = '';
    },
    handleStart() {
      socket.emit('start-game');
    },
    handleDraw() {
      socket.emit('draw-card', { gameId: this.gameId });
    },
    handleEndTurn() {
      socket.emit('end-turn', { gameId: this.gameId });
    },
  },
  mounted() {
    socket.on('connect', () => {
      this.currentPlayerId = socket.id;
    });

    socket.on('lobby-player-list', (players) => {
      this.lobbyPlayerList = players;
      console.log('Updated lobbyPlayerList:', players);
    });

    socket.on('game-started', ({ gameId }) => {
      this.gameStarted = true;
      this.gameId = gameId;
    });

    socket.on('game-state', (state) => {
      console.log('Received game-state:', state);
      this.gamePlayerList = state.players;
      this.currentTurnId = state.currentTurnIndex;
    });

    socket.on('hand-update', (hand) => {
      this.hand = hand;
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>