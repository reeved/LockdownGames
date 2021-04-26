class PokerActivePlayer {
  constructor(playerName, stack, socketID) {
    this.playerName = playerName;
    this.stack = stack;
    this.socketID = socketID;
    this.currentBet = 0;
    this.currentAction = 'waiting';
  }

  bet(amount) {
    this.currentBet += amount;
    this.stack -= amount;
  }
}

module.exports = PokerActivePlayer;
