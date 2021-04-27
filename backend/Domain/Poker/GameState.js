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
    players.forEach((element) => {
      this.playerState.push(new PokerPlayer(element.nickname, STARTING_STACK, element.socketID));
    });
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
    this.playerState.forEach((element) => {
      if (updatedStacks.has(element.playerName)) {
        element.stack = updatedStacks.get(element.playerName);
      }
    });
  }
}

module.exports = GameState;
