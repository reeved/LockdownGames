const CalculateShowDown = require('./CalculateShowdown');
const Deck = require('./Deck');
const GameState = require('./GameState');
const PlayState = require('./PlayState');
class Game {
  constructor(players) {
    this.cardMap = new Map(); //{ playerName => card1, card2 }
    this.deck = new Deck(); //deck
    this.gameState = new GameState(players);
    this.pokerRound = null;
  }

  createPokerRound() {
    this.pokerRound = this.gameState.createPokerRound();
  }

  generateHoleCards() {
    let holeCards = [];
    this.pokerRound.pokerActivePlayers.forEach((element) => {
      let { card1, card2 } = this.deck.getTwoCards();
      holeCards.push({
        socketID: element.socketID,
        card1,
        card2,
      });
      this.cardMap.set(element.playerName, { card1, card2 });
    });
    return holeCards;
  }

  handlePlayStart() {
    this.pokerRound.applyBlinds();
    return this.pokerRound;
  }

  handleFold() {
    let result = this.pokerRound.handleFold();
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
      let roundState = this.checkRoundState();
      if (roundState !== 'allIn') {
        playFinished = this.handleNextRound();
      } else {
        playFinished = 'allIn';
      }
    }
    return {
      userState: this.userState,
      playFinished: playFinished,
    };
  }

  handleCheck() {
    let player = this.userState.playerState[this.isOnActionIndex];
    player.currentAction = 'check';
    player = this.nextPlayer();
    let playFinished = false;
    if (player.currentAction !== 'waiting') {
      playFinished = this.handleNextRound();
    } else {
      player.currentAction = 'onAction';
    }
    return {
      userState: this.userState,
      playFinished: playFinished,
    };
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

  checkRoundState() {
    if (this.userState.whichRound === 3) {
      return 'showdown';
    }
    let noOfPlayerNotAllIn = 0;
    for (let player of this.userState.playerState) {
      if (player.currentAction !== 'fold' && player.currentAction !== 'allIn') {
        noOfPlayerNotAllIn++;
      }
    }
    if (noOfPlayerNotAllIn === 1 || noOfPlayerNotAllIn === 0) {
      return 'allIn';
    }
  }

  handleNextRound() {
    this.userState.whichRound += 1;

    if (this.userState.whichRound === 4) {
      let showdown = this.calculateShowDown();
      return showdown;
    } else {
      this.handleRoundCleanup();
      if (this.userState.whichRound === 1) {
        this.userState.board = [...this.userState.board, this.deck.getACard(), this.deck.getACard(), this.deck.getACard()];
      } else {
        this.userState.board = [...this.userState.board, this.deck.getACard()];
      }
    }
    return false;
  }

  handleAllIn() {
    let boardArray = [];
    let message = '';
    while (this.userState.whichRound !== 4) {
      message = this.handleNextRound();
      boardArray.push(this.userState.board.slice());
    }
    //this.handlePlayCleanup();
    return {
      boardArray: boardArray,
      message: message,
    };
  }

  handleRoundCleanup() {
    for (let player of this.userState.playerState) {
      player.currentBet = 0;
      if (player.currentAction !== 'fold') {
        player.currentAction = 'waiting';
      }
    }
    this.userState.currentRaise = 0;

    this.isOnActionIndex = this.dealerNumber;
    let player = this.nextPlayer();
    player.currentAction = 'onAction';
  }

  handlePlayCleanup() {
    this.nextPlayer();
    this.dealerNumber = this.isOnActionIndex;
    for (let player of this.userState.playerState) {
      if (player.stack === 0) {
        player.isOut = true;
      }
      player.currentBet = 0;
      player.currentAction = 'waiting';
    }
    this.userState.currentRaise = 0;
    this.userState.pot = 0;
    this.userState.board = [];
    this.deck = new Deck();
  }

  nextPlayer() {
    do {
      this.isOnActionIndex = (this.isOnActionIndex + 1) % this.userState.getNumberOfConnectedPeople();
      let player = this.userState.get[this.isOnActionIndex];
    } while (player.currentAction === 'fold' || player.isBusted); //busted or fold
    return player;
  }

  calculateShowDown() {
    //doesn't account for folds
    let arrayOfHands = [];
    let arrayOfPlayerNames = [];
    for (let player of this.map.values()) {
      let arrayOfHand = [];
      arrayOfHand.push(player.getCard1());
      arrayOfHand.push(player.getCard2());
      arrayOfHands.push(arrayOfHand);
      arrayOfPlayerNames.push(player.getName());
    }

    let showdown = new CalculateShowDown(this.userState.board, arrayOfHands, arrayOfPlayerNames, this.userState.pot);
    let { message, winningName, pot } = showdown.getResult();
    for (let player of this.userState.playerState) {
      if (player.playerName === winningName) {
        player.stack += pot;
      }
    }
    return message;
  }

  reset() {
    this.gameState = new GameState();
    this.playState = new PlayState();
  }

  getUserState() {
    return this.userState;
  }
}

module.exports = Game;
