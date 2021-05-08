const PokerPlayer = require('./PokerPlayer');
const PokerRound = require('./PokerRound');
const PokerActivePlayer = require('./PokerActivePlayer');
const Mongo = require('../../Mongo');
const { STARTING_STACK } = require('./Config');

class GameState {
  constructor(players) {
    this.dealerNumber = 0; // who's the dealer
    this.playerState = []; // current playerState with name,stack
    this.stackTrack = new Map(); // map from name to stack changes throughout the game
    this.roundTrack = [0]; // fluff
    players.forEach((element) => {
      // creating the initial playerState from the lobbyState input
      this.playerState.push(new PokerPlayer(element.nickname, STARTING_STACK, element.socketID));
      this.stackTrack.set(element.nickname, [STARTING_STACK]); // sets all stacks to be 1000
    });
    this.result = ''; // string that shows who won
    this.serializedStackTrack = [...this.stackTrack.entries()]; // serialized version of stack track as maps cannot be emitted
  }

  isGameOver() {
    let playerName = null;
    let activePlayers = 0;
    this.playerState.forEach((element) => {
      if (element.stack !== 0) {
        activePlayers += 1;
        playerName = element.playerName;
      }
    });
    if (activePlayers < 2) {
      this.result = `${playerName} has won the game!`;
      const mongo = new Mongo();
      mongo.createGame('poker', this.serializedStackTrack, playerName, this.winPlaces);
      return true;
    }
    this.result = '';
    return false;
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
    this.result = '';
    do {
      this.dealerNumber = (this.dealerNumber + 1) % this.playerState.length;
    } while (this.playerState[this.dealerNumber].stack === 0);
    this.roundTrack.push(this.roundTrack[this.roundTrack.length - 1] + 1);
    this.playerState.forEach((element) => {
      if (updatedStacks.has(element.playerName)) {
        const winnings = updatedStacks.get(element.playerName) - element.stack;
        if (winnings > 0) {
          this.result += `${element.playerName} has won ${winnings} `;
        }
        element.stack = updatedStacks.get(element.playerName);
        this.stackTrack.get(element.playerName).push(element.stack);
      } else {
        this.stackTrack.get(element.playerName).push(0);
      }
    });
    this.serializedStackTrack = [...this.stackTrack.entries()];
  }
}

module.exports = GameState;
