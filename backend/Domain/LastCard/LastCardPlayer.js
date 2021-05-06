class LastCardPlayer {
  constructor(name) {
    this.name = name;
    this.handSize = 7;
    this.isPlaying = true;
  }

  increaseHandSize(amount) {
    this.handSize += amount;
  }

  getHandSize() {
    return this.handSize;
  }
}

module.exports = LastCardPlayer;
