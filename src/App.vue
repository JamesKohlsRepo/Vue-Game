<template>
  <div id="app">
    <HomePage v-if="!joined" @join="handleJoin" />
    <GamePage v-else :playerName="playerName" @leave="handleLeave" />
  </div>
</template>

<script>
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
      playerName: '',
    };
  },
  methods: {
    handleJoin(name) {
      this.playerName = name;
      this.joined = true;
    },
    handleLeave() {
      this.playerName = '';
      this.joined = false;
    }
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