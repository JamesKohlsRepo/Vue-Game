// to run this file, use the command: node testGameLogic.js inside server/game

const Game = require('./gameLogic');

// Create new game instance
const game = new Game();

// Add two players
game.addPlayer('player1-id', 'Alice');
game.addPlayer('player2-id', 'Bob');

// Print the players
console.log("Players:");
console.log(game.players);

// Print the full deck
console.log("\nDeck:");
console.log(game.deck);