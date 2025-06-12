const fs = require('fs');
const path = require('path');

class Game {
    constructor() {
        this.players = [];
        this.deck = this.loadDeck();
        this.state = 'waiting'; // or 'playing', 'ended', etc.
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

    addPlayer(id, name) {
        this.players.push({ id, name, hand: [] });
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