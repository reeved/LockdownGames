const Deck = require('../Poker/Deck');

// eslint-disable-next-line no-unused-vars
class Game {
  constructor() {
    this.deck = new Deck();
    this.discard = [];
    this.players = [];
    this.driection = 0;
  }

  getDeck() {
    return this.deck;
  }

  getPlayers {
    return this.players
  }
}
