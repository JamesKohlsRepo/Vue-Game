// placeholder for game logic

class Game {
  constructor() {
    this.players = [];
    this.state = 'waiting'; // or 'playing', 'ended', etc.
  }

  addPlayer(id, name) {
    this.players.push({ id, name });
  }

  removePlayer(id) {
    this.players = this.players.filter(p => p.id !== id);
  }

  startGame() {
    if (this.players.length >= 2) {
      this.state = 'playing';
      // more logic here
      return true;
    }
    return false;
  }

  getGameState() {
    return {
      players: this.players,
      state: this.state,
    };
  }
}

module.exports = Game;