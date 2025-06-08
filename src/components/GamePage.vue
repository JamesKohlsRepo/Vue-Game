<template>
  <div class="container">
    <h2>Welcome, {{ playerName }}!</h2>
    <button @click="$emit('leave')">Leave Game</button>
  </div>
</template>

<script>
export default {
  name: 'GamePageView',
  props: ['playerName'],
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
button {
  margin-top: 20px;
  padding: 8px 16px;
  font-size: 16px;
}
</style>