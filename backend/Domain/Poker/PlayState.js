

class PlayState {
    constructor(smallBlindValue, bigBlindValue) {
        this.smallBlindValue = smallBlindValue;
        this.bigBlindValue = bigBlindValue;
        this.whichRound = 0;
        this.dealerName = null;
        this.dealerNumber = 0;
        this.isOnActionIndex = 0;
        this.currentRaise = 0;
        this.pot = 0;
        this.playerState = [] //name, stack, currentBet, currentRaise
    }

    playerBet(player, amount) {
        player.currentBet += amount;
        this.pot += amount;
        player.stack -= amount;
        this.currentRaise = Math.max(this.currentRaise, player.currentBet);
    }

    applyBlinds() {
        if (this.playerState.size === 2) {
            this.getNextActivePlayer() //advances isOnActionIndex
        }
        let smallBlindPlayer = this.getNextActivePlayer();
        this.playerBet(smallBlindPlayer, this.smallBlindValue);
        let bigBlindPlayer = this.getNextActivePlayer();
        this.playerBet(bigBlindPlayer, this.bigBlindValue);
        let isOnActionPlayer = this.getNextActivePlayer();
        isOnActionPlayer.currentAction = "onAction";
    }

    handleFold() {
        this.playerState = this.playerState.slice(this.isOnActionIndex, this.isOnActionIndex+1) //removes the player
        this.isOnActionIndex %= this.playerState.size;
        if (this.playerState.size === 1) {
            this.playFinished()
        }
        this.playerState[this.isOnActionIndex].currentAction = "onAction"
    }

    playFinished() {

    }

    getNextActivePlayer() {
        this.isOnActionIndex = (this.isOnActionIndex+1) % this.playerState.size
        return this.playerState[this.isOnActionIndex];
    }

    addPlayer(playerName, stack) {
        this.playerState.push({
            playerName: playerName,
            stack: stack,
            currentBet: 0,
            currentAction: null
        })
    }

}

module.exports = PlayState