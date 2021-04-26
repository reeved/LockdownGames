/* eslint-disable no-restricted-syntax */
const { SMALL_BLIND_VALUE, BIG_BLIND_VALUE } = require('./Config');

class PokerRound {
  constructor(pokerActivePlayers) {
    this.pokerActivePlayers = pokerActivePlayers;
    this.dealerIndex = 0;
    this.onActionIndex = this.dealerIndex + 1;
    this.pot = 0;
    this.currentRaise = 0;
    this.whichRound = 0;
    this.cardMap = null;
    this.board = [];
    this.updatedStacks = new Map(); // from playerName to updatedStack
  }

  applyBlinds() {
    if (this.pokerActivePlayers.length === 2) {
      this.onActionIndex = 0; // for heads-up
    }
    const smallBlindPlayer = this.pokerActivePlayers[this.onActionIndex];
    this.playerBet(smallBlindPlayer, SMALL_BLIND_VALUE);

    this.onActionIndex = (this.onActionIndex + 1) % this.pokerActivePlayers.length;
    const bigBlindPlayer = this.pokerActivePlayers[this.onActionIndex];
    this.playerBet(bigBlindPlayer, BIG_BLIND_VALUE);

    this.onActionIndex = (this.onActionIndex + 1) % this.pokerActivePlayers.length;
    const onActionPlayer = this.pokerActivePlayers[this.onActionIndex];
    onActionPlayer.currentAction = 'onAction';
  }

  playerBet(player, amount) {
    player.bet(amount);
    this.pot += amount;
    this.currentRaise = Math.max(this.currentRaise, player.currentBet);
  }

  handleFold() {
    const playerFolding = this.pokerActivePlayers[this.onActionIndex];
    this.updatedStacks.set(playerFolding.playerName, playerFolding.stack);
    this.pokerActivePlayers.splice(this.onActionIndex, 1);
    if (this.pokerActivePlayers.length === 1) {
      const lastPlayer = this.pokerActivePlayers[this.onActionIndex];
      this.updatedStacks.set(lastPlayer.playerName, lastPlayer.stack + this.pot);
      return {
        type: 'play-over',
        updatedStacks: this.updatedStacks,
      };
    }
    if (this.onActionIndex === this.pokerActivePlayers.length) {
      this.onActionIndex = 0; // end of the array
    } else if (this.onActionIndex === this.dealerIndex) {
      this.dealerIndex = -1; // now the first member of the array acts first, dealer is dead
    }
    this.pokerActivePlayers[this.onActionIndex].currentAction = 'onAction';
    return null;
  }

  handleCheck() {
    const playerChecking = this.pokerActivePlayers[this.onActionIndex];
    playerChecking.currentAction = 'check';
    this.onActionIndex = (this.onActionIndex + 1) % this.pokerActivePlayers.length;
    const onActionPlayer = this.pokerActivePlayers[this.onActionIndex];
    if (onActionPlayer.currentAction === 'check' || this.whichRound === 0) {
      const status = this.roundCleanup();
      return status;
    }
    onActionPlayer.currentAction = 'onAction';
    return null;
  }

  handleCall(amount) {
    const playerCalling = this.pokerActivePlayers[this.onActionIndex];
    this.playerBet(playerCalling, amount);
    playerCalling.currentAction = 'call';
    this.onActionIndex = (this.onActionIndex + 1) % this.pokerActivePlayers.length;
    const onActionPlayer = this.pokerActivePlayers[this.onActionIndex];
    if (onActionPlayer.currentAction === 'raise' || onActionPlayer.currentAction === 'all-in' || onActionPlayer.currentAction === 'bet') {
      const status = this.roundCleanup();
      return status;
    }
    onActionPlayer.currentAction = 'onAction';
    return null;
  }

  updateBoard(newCards) {
    this.board = this.board.concat(newCards);
  }

  roundCleanup() {
    if (this.whichRound === 3) {
      return {
        type: 'play-over',
        updatedStacks: this.updatedStacks,
      };
    }
    this.currentRaise = 0;
    this.whichRound += 1;
    this.onActionIndex = this.dealerIndex + 1;
    // eslint-disable-next-line guard-for-in
    for (const i in this.pokerActivePlayers) {
      this.pokerActivePlayers[i].currentAction = 'waiting';
      this.pokerActivePlayers[i].currentBet = 0;
    }
    this.pokerActivePlayers[this.onActionIndex].currentAction = 'onAction';
    return {
      type: 'round-over',
    };
  }

  // calculateResult() {}

  // clear() {}
}

module.exports = PokerRound;
