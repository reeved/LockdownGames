/* eslint-disable no-restricted-syntax */
const Card = require('./Card.js');

class Deck {
  constructor() {
    this.state = this.createDeck();
    this.shuffleDeck();
  }

  getSize() {
    return this.state.length;
  }

  getTwoCards() {
    return {
      card1: this.getACard(),
      card2: this.getACard(),
    };
  }

  getACard() {
    this.shuffleDeck();
    const cardArray = this.state.splice(-1, 1);
    return `${cardArray[0].getValue()}${cardArray[0].getSuit()}`;
  }

  // eslint-disable-next-line class-methods-use-this
  createDeck() {
    const state = [];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['C', 'D', 'H', 'S'];
    for (const value of values) {
      for (const suit of suits) {
        const card = new Card(value, suit);
        state.push(card);
      }
    }
    return state;
  }

  shuffleDeck() {
    for (let i = this.state.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.state[i];
      this.state[i] = this.state[j];
      this.state[j] = temp;
    }
  }
}
module.exports = Deck;
