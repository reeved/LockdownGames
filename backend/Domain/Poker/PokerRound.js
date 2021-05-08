const { SMALL_BLIND_VALUE, BIG_BLIND_VALUE } = require('./Config');
const CalculateShowDown = require('./CalculateShowdown');

class PokerRound {
  constructor(pokerActivePlayers) {
    this.pokerActivePlayers = pokerActivePlayers;
    this.foldedPlayers = [];
    this.allInPlayers = [];
    this.dealerIndex = 0;
    this.onActionIndex = this.dealerIndex + 1;
    this.pot = 0;
    this.betsPot = 0;
    this.currentRaise = 0;
    this.whichRound = 0;
    this.cardMap = null;
    this.board = [];
    this.dealerName = null;
    this.updatedStacks = new Map(); // from playerName to updatedStack
  }

  applyBlinds() {
    this.dealerName = this.pokerActivePlayers[this.dealerIndex].playerName;
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
    this.betsPot += amount;
    this.currentRaise = Math.max(this.currentRaise, player.currentBet);
  }

  handleFold() {
    let playerFolding = this.pokerActivePlayers[this.onActionIndex];
    this.cardMap.delete(playerFolding.playerName);
    this.updatedStacks.set(playerFolding.playerName, playerFolding.stack);
    playerFolding = this.pokerActivePlayers.splice(this.onActionIndex, 1);
    this.foldedPlayers = this.foldedPlayers.concat(playerFolding);
    if (this.onActionIndex === this.pokerActivePlayers.length) {
      this.onActionIndex = 0; // end of the array
    }
    if (this.checkAllIn()) {
      return { type: 'all-in' };
    }
    if (this.pokerActivePlayers.length === 1 && this.allInPlayers.length === 0) {
      if (this.onActionIndex === this.pokerActivePlayers.length) {
        this.onActionIndex = 0; // end of the array
      }
      const lastPlayer = this.pokerActivePlayers[this.onActionIndex];
      this.updatedStacks.set(lastPlayer.playerName, lastPlayer.stack + this.pot + this.betsPot);
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

  async handleCall(amount) {
    const playerCalling = this.pokerActivePlayers[this.onActionIndex];
    this.playerBet(playerCalling, amount);
    if (playerCalling.stack === 0) {
      this.pokerActivePlayers.splice(this.onActionIndex, 1);
      this.allInPlayers = this.allInPlayers.concat(playerCalling);
      if (this.onActionIndex === this.pokerActivePlayers.length) {
        this.onActionIndex = 0; // end of the array
      } else if (this.onActionIndex === this.dealerIndex) {
        this.dealerIndex = -1; // now the first member of the array acts first, dealer is dead
      }
    }
    if (this.checkAllIn()) {
      return { type: 'all-in' };
    }
    playerCalling.currentAction = 'call';
    this.onActionIndex = (this.onActionIndex + 1) % this.pokerActivePlayers.length;
    const onActionPlayer = this.pokerActivePlayers[this.onActionIndex];
    if (
      onActionPlayer.playerName === playerCalling.playerName ||
      onActionPlayer.currentAction === 'raise' ||
      onActionPlayer.currentAction === 'all-in'
    ) {
      const status = await this.roundCleanup();
      return status;
    }
    onActionPlayer.currentAction = 'onAction';
    return null;
  }

  handleRaise(amount) {
    let playerRaising = this.pokerActivePlayers[this.onActionIndex];
    this.playerBet(playerRaising, amount);
    if (playerRaising.stack === 0) {
      playerRaising = this.pokerActivePlayers.splice(this.onActionIndex, 1);
      this.allInPlayers = this.allInPlayers.concat(playerRaising);
      if (this.onActionIndex === this.pokerActivePlayers.length) {
        this.onActionIndex = 0; // end of the array
      } else if (this.onActionIndex === this.dealerIndex) {
        this.dealerIndex = -1; // now the first member of the array acts first, dealer is dead
      }
    } else {
      this.pokerActivePlayers.forEach((element) => {
        element.currentAction = 'waiting';
      });
      playerRaising.currentAction = 'raise';
      this.onActionIndex = (this.onActionIndex + 1) % this.pokerActivePlayers.length;
    }
    this.pokerActivePlayers[this.onActionIndex].currentAction = 'onAction';
  }

  checkAllIn() {
    if (
      this.pokerActivePlayers.length === 0 ||
      (this.allInPlayers.length > 0 &&
        this.pokerActivePlayers.length < 2 &&
        this.whichRound !== 3 &&
        this.pokerActivePlayers[this.onActionIndex].currentAction !== 'waiting')
    ) {
      return true;
    }
    return false;
  }

  async updateBoard(newCards) {
    this.board = this.board.concat(newCards);
  }

  async roundCleanup() {
    if (this.whichRound === 3) {
      const updatedStacks = await this.handleShowdown();
      return {
        type: 'play-over',
        updatedStacks,
      };
    }
    this.pot += this.betsPot;
    this.betsPot = 0;
    this.currentRaise = 0;
    this.whichRound += 1;
    this.onActionIndex = this.dealerIndex + 1;
    this.allInPlayers.forEach((element) => {
      element.currentBet = 0;
    });
    this.pokerActivePlayers.forEach((element) => {
      element.currentAction = 'waiting';
      element.currentBet = 0;
    });
    if (this.pokerActivePlayers.length !== 1 && this.pokerActivePlayers.length !== 0) {
      this.pokerActivePlayers[this.onActionIndex].currentAction = 'onAction';
    }
    return {
      type: 'round-over',
    };
  }

  async handleShowdown() {
    const showdown = new CalculateShowDown(
      this.board,
      this.pokerActivePlayers,
      this.foldedPlayers,
      this.allInPlayers,
      this.cardMap,
      this.updatedStacks
    );
    this.updatedStacks = await showdown.distributeWinnings();
    return this.updatedStacks;
  }
  // calculateResult() {}

  // clear() {}
}

module.exports = PokerRound;
