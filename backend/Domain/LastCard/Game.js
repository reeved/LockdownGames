const Deck = require('../Common/Deck');
const LastCardPlayer = require('./LastCardPlayer');

// eslint-disable-next-line no-unused-vars
class Game {
  constructor(allPlayers) {
    this.deck = new Deck();
    this.deck.setDeck();
    this.discard = new Deck();
    this.players = [];
    // eslint-disable-next-line no-console
    allPlayers.forEach((element) => {
      this.players.push(new LastCardPlayer(element.nickname));
    });

    this.direction = 1;
  }

  getDeck() {
    return this.deck;
  }

  getPlayers() {
    return this.players;
  }

  setPlayers(players) {
    this.players = players;
  }

  getHand() {
    return this.deck.getLastCardHand();
  }

  startNewDeck() {
    this.deck = this.discard;
    this.deck.shuffleDeck();
    this.discard = new Deck();
    return this.deck;
  }

  getDiscard() {
    return this.discard;
  }

  switchDirection() {
    this.direction *= -1;
  }

  getDirection() {
    return this.direction;
  }
}

module.exports = Game;
