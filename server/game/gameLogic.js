const fs = require('fs');
const path = require('path');

class Game {
    constructor() {
        this.players = [];
        this.deck = this.loadDeck();
        this.discardPile = [];
        this.currentTurnIndex = 0;
        this.state = 'waiting';
    }

    loadDeck() {
        const data = fs.readFileSync(path.join(__dirname, 'deepSeaCards.jsonl'), 'utf-8');
        const lines = data.trim().split('\n');
        const cards = lines.map(line => JSON.parse(line));
        return this.shuffle(cards);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    drawCard() {
        if (this.deck.length === 0) {
            this.deck = this.shuffle(this.discardPile);
            this.discardPile = [];
        }

        const card = this.deck.shift();
        const player = this.getCurrentPlayer();

        player.hand.push(card);

        if (this.isLowPower(card)) {
            player.lowPowerCount += 1;
        }

        if (player.lowPowerCount >= 3) {
            player.busted = true;
            this.endTurn();
        }

        return {
            card,
            hand: player.hand,
            lowPowerCount: player.lowPowerCount,
            busted: player.busted
        };
    }

    isLowPower(card) {
        return card.name === 'low power';
    }

    addPlayer(id, name) {
        this.players.push({
            id,
            name,
            hand: [],
            lowPowerCount: 0,
            busted: false
        });
    }

    removePlayer(id) {
        this.players = this.players.filter(p => p.id !== id);
    }

    getCurrentPlayer() {
        return this.players[this.currentTurnIndex];
    }

    startGame() {
        if (this.players.length >= 2) {
            this.state = 'playing';
            this.deck = this.loadDeck(); 
            this.discardPile = [];

            for (let player of this.players) {
                player.hand = [];
                player.lowPowerCount = 0;
                player.busted = false;
            }

            this.currentTurnIndex = 0;

            return true;
        }
        return false;
    }

    endTurn() {
        const player = this.getCurrentPlayer();
        this.discardPile.push(...player.hand);

        player.hand = [];
        player.lowPowerCount = 0;
        player.busted = false;

        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    }

    getGameState() {
        return {
            players: this.players,
            state: this.state,
        };
    }
}

module.exports = Game;