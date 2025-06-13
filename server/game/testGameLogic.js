// to run this file, use the command: node testGameLogic.js inside server/game
const readline = require('readline');
const Game = require('./gameLogic');

// Create new game instance
const game = new Game();

// Add two players
game.addPlayer('player1-id', 'Alice');
game.addPlayer('player2-id', 'Bob');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function playerTurn() {
  const player = game.getCurrentPlayer();
  console.log(`\n--- ${player.name}'s turn ---`);
  console.log(`Current hand:`, player.hand.map(c => c.name).join(', '));
  console.log(`Low Power Count: ${player.lowPowerCount}`);

  rl.question('Draw a card or end turn? (d/e): ', (answer) => {
    if (answer === 'd') {
      const result = game.drawCard();
      console.log(`Drew: ${result.card.name}`);

      if (result.busted) {
        console.log(`${player.name} busted!`);
        // Automatically moves to next player
        checkGameState();
      } else {
        playerTurn(); // Keep going
      }
    } else if (answer === 'e') {
      console.log(`${player.name} ended their turn.`);
      game.endTurn();
      checkGameState();
    } else {
      console.log("Invalid input. Type 'd' to draw or 'e' to end turn.");
      playerTurn(); // re-prompt
    }
  });
}

function checkGameState() {
  // For now we just keep looping forever
  playerTurn();
}

playerTurn();
