class PokerPlayer {
  constructor(name, startingStack, socketID) {
    this.playerName = name;
    this.stack = startingStack;
    this.socketID = socketID;
  }

  getName() {
    return this.name;
  }
}

module.exports = PokerPlayer;
