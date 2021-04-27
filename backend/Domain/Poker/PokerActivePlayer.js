class PokerActivePlayer {
  constructor(playerName, stack, socketID) {
    this.playerName = playerName;
    this.stack = stack;
    this.invested = 0;
    this.socketID = socketID;
    this.currentBet = 0;
    this.currentAction = 'waiting';
  }

  bet(amount) {
    this.currentBet += amount;
    this.invested += amount;
    this.stack -= amount;
  }
}

module.exports = PokerActivePlayer;
