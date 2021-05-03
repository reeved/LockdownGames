const PokerPlayer = require('./PokerPlayer');
const PokerRound = require('./PokerRound');
const PokerActivePlayer = require('./PokerActivePlayer');
const { STARTING_STACK } = require('./Config');

class GameState {
  constructor(players) {
    this.gameStarted = false;
    this.gameFinished = false;
    this.dealerNumber = 0;
    this.playerState = [];
    this.stackTrack = new Map();
    this.roundTrack = [0];
    players.forEach((element) => {
      this.playerState.push(new PokerPlayer(element.nickname, STARTING_STACK, element.socketID));
      this.stackTrack.set(element.nickname, [1000]);
    });
  }

  isGameOver() {
    let activePlayers = 0;
    this.playerState.forEach((element) => {
      if (element.stack !== 0) activePlayers += 1;
    });
    return activePlayers < 2;
  }

  createPokerRound() {
    const pokerActivePlayers = [];
    for (let i = 0; i < this.playerState.length; i += 1) {
      const playerIndex = (this.dealerNumber + i) % this.playerState.length;
      const { playerName, stack, socketID } = this.playerState[playerIndex];
      if (stack !== 0) {
        pokerActivePlayers.push(new PokerActivePlayer(playerName, stack, socketID));
      }
    }
    return new PokerRound(pokerActivePlayers);
  }

  updateStacks(updatedStacks) {
    do {
      this.dealerNumber = (this.dealerNumber + 1) % this.playerState.length;
    } while (this.playerState[this.dealerNumber].stack === 0);
    this.roundTrack.push(this.roundTrack[this.roundTrack.length - 1] + 1);
    this.playerState.forEach((element) => {
      if (updatedStacks.has(element.playerName)) {
        element.stack = updatedStacks.get(element.playerName);
        this.stackTrack.get(element.playerName).push(element.stack);
      } else {
        this.stackTrack.get(element.playerName).push(0);
      }
    });
  }
}

module.exports = GameState;
