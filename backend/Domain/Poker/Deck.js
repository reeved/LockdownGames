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
    let cardArray = this.state.splice(-2, 2);
    return {
      card1: cardArray[0].getValue() + cardArray[0].getSuit(),
      card2: cardArray[1].getValue() + cardArray[1].getSuit(),
    };
  }

  getACard() {
    this.shuffleDeck();
    let cardArray = this.state.splice(-1, 1);
    return '' + cardArray[0].getValue() + '' + cardArray[0].getSuit();
  }

  createDeck() {
    let state = [];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['C', 'D', 'H', 'S'];
    for (let value of values) {
      for (let suit of suits) {
        let card = new Card(value, suit);
        state.push(card);
      }
    }
    return state;
  }

  shuffleDeck() {
    for (var i = this.state.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = this.state[i];
      this.state[i] = this.state[j];
      this.state[j] = temp;
    }
  }
}
module.exports = Deck;
