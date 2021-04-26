const { STARTING_STACK, SMALL_BLIND_VALUE, BIG_BLIND_VALUE } = require('./Config');
class PokerRound {
  constructor(pokerActivePlayers) {
    this.pokerActivePlayers = pokerActivePlayers;
    this.dealerIndex = 0;
    this.onActionIndex = this.dealerIndex + 1;
    this.pot = 0;
    this.currentRaise = 0;
    this.whichRound = 0;
    this.board = [];
    this.updatedStacks = new Map(); // from playerName to updatedStack
  }

  applyBlinds() {
    if (this.pokerActivePlayers.length == 2) {
      this.onActionIndex = 0; // for heads-up
    }
    let smallBlindPlayer = this.pokerActivePlayers[this.onActionIndex];
    this.playerBet(smallBlindPlayer, SMALL_BLIND_VALUE);

    this.onActionIndex = (this.onActionIndex + 1) % this.pokerActivePlayers.length;
    let bigBlindPlayer = this.pokerActivePlayers[this.onActionIndex];
    this.playerBet(bigBlindPlayer, BIG_BLIND_VALUE);

    this.onActionIndex = (this.onActionIndex + 1) % this.pokerActivePlayers.length;
    let onActionPlayer = this.pokerActivePlayers[this.onActionIndex];
    onActionPlayer.currentAction = 'onAction';
  }

  playerBet(player, amount) {
    player.bet(amount);
    this.pot += amount;
    this.currentRaise = Math.max(this.currentRaise, player.currentBet);
  }

  handleFold() {
    let playerFolding = this.pokerActivePlayers[this.onActionIndex];
    this.updatedStacks.set(playerFolding.playerName, playerFolding.stack);
    this.pokerActivePlayers.splice(this.onActionIndex, 1);
    if (this.pokerActivePlayers.length === 1) {
      let lastPlayer = this.pokerActivePlayers[this.onActionIndex];
      this.updatedStacks.set(lastPlayer.playerName, lastPlayer.stack + this.pot);
      return {
        type: 'play-over',
        updatedStacks: this.updatedStacks,
      };
    } else if (this.onActionIndex === this.pokerActivePlayers.length) {
      this.onActionIndex = 0; //end of the array
    } else if (this.onActionIndex === this.dealerIndex) {
      this.dealerIndex = -1; //now the first member of the array acts first, dealer is dead
    }
    this.pokerActivePlayers[this.onActionIndex].currentAction = 'onAction';
  }

  calculateResult() {}

  clear() {}
}

module.exports = PokerRound;
