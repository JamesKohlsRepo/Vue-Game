<template>
  <div class="container">
    <h2>({{ currentPlayerCount }}/4) Players in the Game!</h2>
    <ul class="player-list">
      <li v-for="player in playerList" :key="player.id" :class="{ 'current-player': player.id === currentPlayerId }">
        {{ player.name }}
      </li>
    </ul>
    <div>
      <button @click="$emit('leave')">
        Leave Game
      </button>
    </div>
    <div v-if="yourTurn">
      <button @click="drawCard">Draw Card</button>
      <button @click="endTurn">End Turn</button>
    </div>
    <div v-else>
      <p>Waiting for your turn...</p>
    </div>
    <div>
      <h3>Your Hand:</h3>
      <ul>
        <li v-for="card in hand" :key="card.name">{{ card.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GamePage',
  props: ['playerList', 'currentPlayerId', 'gameId', 'currentTurnId', 'hand'],
  computed: {
    currentPlayerName() {
      return this.playerList.find(p => p.id === this.currentPlayerId);
    },
    currentPlayerCount() {
      return this.playerList.length;
    },
    yourTurn() {
      return this.currentPlayerId === this.currentTurnId;
    }
  },
  methods: {
    drawCard() {
      this.$emit('draw-card');
    },
    endTurn() {
      this.$emit('end-turn');
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
}

button {
  border: 2px solid #178eab;
  margin-top: 20px;
  margin: 10px;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 12px;
}

button:hover {
  background-color: #8ab8b9;
}

.player-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.player-list li {
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 16px;
  background-color: #f9f9f9;
}

.current-player {
  border-color: #007bff;
  background-color: #e7f1ff;
  font-weight: bold;
}
</style>