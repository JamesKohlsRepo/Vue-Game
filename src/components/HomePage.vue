<template>
  <div class="container">
    <h2>Join the Game</h2>
    <input v-model="name" placeholder="Enter your name" />
    <button @click="joinGame" :disabled="!name.trim()">Join Game</button>
  </div>
</template>

<script>
export default {
  name: 'HomePageView',
  data() {
    return {
      name: '',
    };
  },
  methods: {
    joinGame() {
      this.$emit('join', this.name.trim());
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
  height: 100vh;
}
input {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
}
button {
  padding: 8px 16px;
  font-size: 16px;
}
</style> 