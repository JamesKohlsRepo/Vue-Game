<template>
  <div id="app">
    <HomePage v-if="!joined" @join="handleJoin" />
    <GamePage v-else 
      :playerList="playerList" 
      :currentPlayerId="currentPlayerId" 
      @leave="handleLeave" 
    />
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import HomePage from './components/HomePage.vue';
import GamePage from './components/GamePage.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    GamePage,
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
      const id = uuidv4();
      this.currentPlayerId = id;
      this.playerList.push({ id, name });
      this.joined = true;
    },
    handleLeave() {
      this.playerList = this.playerList.filter(
        player => player.id !== this.currentPlayerId
      );
      this.currentPlayerId = '';
      this.joined = false;
    }
  },
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