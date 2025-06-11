<template>
  <div id="app">
    <HomePage v-if="!joined" @join="handleJoin" />
    <LobbyPage 
      v-else 
      :playerList="playerList" 
      :currentPlayerId="currentPlayerId" 
      @leave="handleLeave" 
    />
  </div>
</template>

<script>
import socket from './socket.js';
import HomePage from './components/HomePage.vue';
import LobbyPage from './components/LobbyPage.vue';
//import GamePage from './components/GamePage.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    LobbyPage,
  },
  data() {
    return {
      joined: false,
      currentPlayerId: '',
      playerList: [],
    };
  },
  methods: {
    handleJoin(name) {
      this.joined = true;
      this.currentPlayerId = socket.id;
      socket.emit('player-joined', { name });
    },
    handleLeave() {
      socket.emit('player-left');
      this.joined = false;
      this.currentPlayerId = '';
    },
    handleStart() {
      
    }
  },
  mounted() {
    socket.on('connect', () => {
      this.currentPlayerId = socket.id;
    });

    socket.on('player-list', (players) => {
      this.playerList = players;
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