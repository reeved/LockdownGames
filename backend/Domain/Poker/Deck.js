const Card = require('./Card.js');

class Deck {
  constructor() {
    this.state = Deck.createDeck();
    this.shuffleDeck();
  }

  getSize() {
    return this.state.length;
  }

  getThreeCards() {
    const cardArray = [this.getACard(), this.getACard(), this.getACard()];
    return cardArray;
  }

  getHoleCards() {
    return {
      card1: this.getACard(),
      card2: this.getACard(),
    };
  }

  getLastCardHand() {
    const hand = [];

    for (let i = 0; i < 7; i += 1) {
      hand.push(this.getACard());
    }

    return hand;
  }

  getACard() {
    const cardArray = this.state.splice(-1, 1);
    return cardArray[0].getValue() + cardArray[0].getSuit();
  }

  static createDeck() {
    const state = [];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['C', 'D', 'H', 'S'];
    values.forEach((value) => {
      suits.forEach((suit) => {
        state.push(new Card(value, suit));
      });
    });
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
