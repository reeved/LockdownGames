/* eslint-disable no-restricted-syntax */
const CalculateShowDown = require('./CalculateShowdown');
const Deck = require('./Deck');
const GameState = require('./GameState');

class Game {
  constructor(players) {
    this.cardMap = new Map(); // { playerName => card1, card2 }
    this.deck = new Deck(); // deck
    this.gameState = new GameState(players);
    this.pokerRound = null;
  }

  createPokerRound() {
    this.pokerRound = this.gameState.createPokerRound();
  }

  generateHoleCards() {
    const holeCards = [];
    const cardMap = new Map();
    this.pokerRound.pokerActivePlayers.forEach((element) => {
      const { card1, card2 } = this.deck.getTwoCards();
      holeCards.push({
        socketID: element.socketID,
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
    if (result && result.type === 'play-over') {
      this.handlePlayOver(result.updatedStacks);
      return this.gameState;
    }
    return this.pokerRound;
  }

  handlePlayOver(updatedStacks) {
    this.gameState.updateStacks(updatedStacks);
  }

  handleCall(amount) {
    let player = this.userState.playerState[this.isOnActionIndex];
    player.stack -= amount;
    player.currentBet += amount;
    player.currentAction = 'called';
    this.userState.pot += amount;

    player = this.nextPlayer();
    let playFinished = false;
    if (player.currentAction === 'waiting') {
      player.currentAction = 'onAction';
    } else if (player.currentAction === 'raise' || player.currentAction === 'allIn') {
      const roundState = this.checkRoundState();
      if (roundState !== 'allIn') {
        playFinished = this.handleNextRound();
      } else {
        playFinished = 'allIn';
      }
    }
    return {
      userState: this.userState,
      playFinished,
    };
  }

  handleCheck() {
    const result = this.pokerRound.handleCheck();
    if (result && result.type === 'round-over') {
      this.updateBoard();
    } else if (result && result.type === 'play-over') {
      // todo
    }
    return null;
  }

  handleRaise(amount) {
    let player = this.userState.playerState[this.isOnActionIndex];
    player.currentAction = 'raise';
    player.stack -= amount - player.currentBet;
    this.userState.pot += amount - player.currentBet;
    if (player.stack === 0) {
      player.currentAction = 'allIn';
    }
    player.currentBet = amount;
    this.userState.currentRaise = amount;
    player = this.nextPlayer();
    player.currentAction = 'onAction';
    return {
      userState: this.userState,
    };
  }

  calculateShowDown() {
    // doesn't account for folds
    const arrayOfHands = [];
    const arrayOfPlayerNames = [];
    for (const player of this.map.values()) {
      const arrayOfHand = [];
      arrayOfHand.push(player.getCard1());
      arrayOfHand.push(player.getCard2());
      arrayOfHands.push(arrayOfHand);
      arrayOfPlayerNames.push(player.getName());
    }

    const showdown = new CalculateShowDown(this.userState.board, arrayOfHands, arrayOfPlayerNames, this.userState.pot);
    const { message, winningName, pot } = showdown.getResult();
    for (const player of this.userState.playerState) {
      if (player.playerName === winningName) {
        player.stack += pot;
      }
    }
    return message;
  }

  reset() {
    this.gameState = new GameState();
  }

  getUserState() {
    return this.userState;
  }
}

module.exports = Game;
