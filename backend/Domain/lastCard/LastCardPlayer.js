class LastCardPlayer {
  constructor(name, handSize, socketID) {
    this.playerName = name;
    this.playerHandSize = handSize;
    this.isPlaying = true;
    this.socketID = socketID;
  }
}

module.exports = LastCardPlayer;
