// const CalculateShowDown = require('./CalculateShowdown');
const Deck = require('./Deck');
const GameState = require('./GameState');

class Game {
  constructor(players) {
    this.deck = new Deck(); // deck
    this.deck.setDeck();
    this.gameState = new GameState(players);
    this.pokerRound = null;
  }

  createPokerRound() {
    this.pokerRound = this.gameState.createPokerRound();
  }

  distributeHoleCards() {
    const holeCards = [];
    const cardMap = new Map();
    this.pokerRound.pokerActivePlayers.forEach((element) => {
      const { card1, card2 } = this.deck.getHoleCards();
      holeCards.push({
        socketID: element.socketID,
        playerName: element.playerName,
        card1,
        card2,
      });
      cardMap.set(element.playerName, { card1, card2 });
    });
    this.pokerRound.cardMap = cardMap;
    return holeCards;
  }

  handlePlayStart() {
    this.pokerRound.applyBlinds();
    return this.pokerRound;
  }

  handleFold() {
    const result = this.pokerRound.handleFold();
    return this.evaluateResult(result);
  }

  handleCheck() {
    const result = this.pokerRound.handleCheck();
    return this.evaluateResult(result);
  }

  handleCall(amount) {
    const result = this.pokerRound.handleCall(amount);
    return this.evaluateResult(result);
  }

  handleRaise(amount) {
    const result = this.pokerRound.handleRaise(amount);
    return this.evaluateResult(result);
  }

  evaluateResult(result) {
    if (result && result.type === 'round-over') {
      this.updateBoard();
      return this.pokerRound;
    }
    if (result && result.type === 'play-over') {
      this.handlePlayOver(result.updatedStacks);
      return this.gameState;
    }
    if (result && result.type === 'all-in') {
      return this.handleAllIn();
    }
    return this.pokerRound;
  }

  handleAllIn() {
    const states = [];
    while (this.pokerRound.whichRound !== 3) {
      this.pokerRound.roundCleanup();
      this.updateBoard();
      states.push(Game.clone(this.pokerRound));
    }
    const result = this.pokerRound.roundCleanup();
    this.handlePlayOver(result.updatedStacks);
    states.push(this.gameState);
    return states;
  }

  handlePlayOver(updatedStacks) {
    this.gameState.updateStacks(updatedStacks);
  }

  updateBoard() {
    if (this.pokerRound.whichRound === 1) {
      // flop
      this.pokerRound.updateBoard(this.deck.getThreeCards());
    } else {
      this.pokerRound.updateBoard(this.deck.getACard());
    }
  }

  // calculateShowDown() {}

  reset() {
    // todo
    this.gameState = new GameState();
  }

  static clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

module.exports = Game;
