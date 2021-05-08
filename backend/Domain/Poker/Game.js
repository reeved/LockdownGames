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
    this.deck = new Deck(); // create a new Deck for each pokerRound
    this.deck.setDeck();
    this.pokerRound = this.gameState.createPokerRound();
  }

  // gets two cards for each player, and sends it out just to them.
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
      // sets the playerName to an object with the hole cards that they have
      cardMap.set(element.playerName, { card1, card2 });
    });
    // sets the cardMap, used for showdown
    this.pokerRound.cardMap = cardMap;
    return holeCards;
  }

  handlePlayStart() {
    // starts the pokerROund by applying blinds, this makes the first two players bet
    // as well as making the actionPlayer be action
    this.pokerRound.applyBlinds();
    return this.pokerRound;
  }

  async handleFold() {
    // causes fold on pokerRound then evaluates the result given
    // results can be round-over, play-over, all-in
    const result = await this.pokerRound.handleFold();
    return this.evaluateResult(result);
  }

  async handleCheck() {
    const result = await this.pokerRound.handleCheck();
    return this.evaluateResult(result);
  }

  async handleCall(amount) {
    const result = await this.pokerRound.handleCall(amount);
    return this.evaluateResult(result);
  }

  async handleRaise(amount) {
    const result = await this.pokerRound.handleRaise(amount);
    return this.evaluateResult(result);
  }

  async evaluateResult(result) {
    // round-over, we need to update the board which may cause showdown, we are not sure atm
    if (result && result.type === 'round-over') {
      await this.updateBoard();
      return this.pokerRound;
    }
    // the whole play is over, either showdown, or fold, we update the stacks from the pokerRound to the gameState, and return the new GameState
    if (result && result.type === 'play-over') {
      await this.handlePlayOver(result.updatedStacks);
      return this.gameState;
    }
    // its allin, meaning players do not have any more options they need to do and we need to automatically update the board until showdown
    if (result && result.type === 'all-in') {
      return this.handleAllIn();
    }
    // default is pokerRound, if result is null
    return this.pokerRound;
  }

  async handleAllIn() {
    const states = [];
    while (this.pokerRound.whichRound !== 3) {
      // eslint-disable-next-line no-await-in-loop
      await this.pokerRound.roundCleanup();
      this.updateBoard();
      states.push(Game.clone(this.pokerRound));
    }
    const result = await this.pokerRound.roundCleanup();
    this.handlePlayOver(result.updatedStacks);
    states.push(this.gameState);
    return states;
  }

  handlePlayOver(updatedStacks) {
    this.gameState.updateStacks(updatedStacks);
  }

  async updateBoard() {
    if (this.pokerRound.whichRound === 1) {
      // flop
      await this.pokerRound.updateBoard(this.deck.getThreeCards());
    } else {
      await this.pokerRound.updateBoard(this.deck.getACard());
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
