const PokerPlayer = require('./PokerPlayer');
const PokerRound = require('./PokerRound');
const PokerActivePlayer = require('./PokerActivePlayer');
const { STARTING_STACK, SMALL_BLIND_VALUE, BIG_BLIND_VALUE } = require('./Config');

class GameState {
  constructor(players) {
    this.gameStarted = false;
    this.gameFinished = false;
    this.dealerNumber = 0;
    this.playerState = [];
    players.forEach((element) => {
      this.playerState.push(new PokerPlayer(element.nickname, STARTING_STACK, element.socketID));
    });
  }

  createPokerRound() {
    let pokerActivePlayers = [];
    for (let i = 0; i < this.playerState.length; i++) {
      let playerIndex = (this.dealerNumber + i) % this.playerState.length;
      let { playerName, stack, socketID } = this.playerState[playerIndex];
      if (stack !== 0) {
        pokerActivePlayers.push(new PokerActivePlayer(playerName, stack, socketID));
      }
    }
    return new PokerRound(pokerActivePlayers);
  }

  updateStacks(updatedStacks) {
    for (let i in this.playerState) {
      if (updatedStacks.has(this.playerState[i].playerName)) {
        this.playerState[i].stack = updatedStacks.get(this.playerState[i].playerName);
      }
    }
  }
}

module.exports = GameState;
