<template>
  <div class="container">
    <h2>({{ currentPlayerCount }}/4) Players in the Lobby</h2>
        <ul class="player-list">
            <li 
                v-for="player in playerList" 
                :key="player.id"
                :class="{ 'current-player': player.id === currentPlayerId }"
            >
                {{ player.name }}
            </li>
        </ul>
    <div>
        <button 
            @click="$emit('leave')" 
        >
        Leave Game
        </button>
      <button @click="$emit('Start')">Start Game</button>
    </div>  
  </div>
</template>

<script>
export default {
  name: 'GamePageView',
  props: ['playerList', 'currentPlayerId'],
  computed: {
    currentPlayerName() {
      return this.playerList.find(p => p.id === this.currentPlayerId);
    },
    currentPlayerCount() {
      return this.playerList.length;
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
  border: 2px solid #ccc;
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