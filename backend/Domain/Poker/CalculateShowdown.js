/* eslint-disable no-unused-vars */
const fetch = require('node-fetch');

class CalculateShowDown {
  constructor(board, pokerActivePlayers, foldedPlayers, allInPlayers, cardMap, updatedStacks) {
    this.sortOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.board = board;
    this.activePlayers = pokerActivePlayers.concat(allInPlayers);
    this.foldedPlayers = foldedPlayers;
    this.cardMap = cardMap;
    this.updatedStacks = updatedStacks;
  }

  static async fetchFromPokerApi(board, cardMap) {
    const urlBoard = `cc=${board[0]},${board[1]},${board[2]},${board[3]},${board[4]}`;
    let urlCards = '';
    cardMap.forEach((value) => {
      const urlPlayer = `&pc[]=${value.card1},${value.card2}`;
      urlCards += urlPlayer;
    });
    const url = `https://api.pokerapi.dev/v1/winner/texas_holdem?${urlBoard}${urlCards}`;

    const data = await fetch(url)
      .then((response) => response.json())
      .then((price) => {
        return price;
      });
    return data;
  }

  async distributeWinnings() {
    while (this.activePlayers.length > 1) {
      let pot = 0;
      let minStack = Number.POSITIVE_INFINITY;
      this.activePlayers.forEach((element) => {
        if (element.invested < minStack) minStack = element.invested; // getting minStack
      });
      pot += minStack * this.activePlayers.length;
      this.foldedPlayers.forEach((element) => {
        if (element.invested >= minStack) {
          element.invested -= minStack;
          pot += minStack;
        } else {
          pot += element.invested;
          element.invested = 0;
        }
      });
      this.activePlayers.forEach((element) => {
        element.invested -= minStack;
      });
      // eslint-disable-next-line no-await-in-loop
      const result = await CalculateShowDown.fetchFromPokerApi(this.board, this.cardMap);
      const winnersCards = result.winners;
      const winners = [];
      this.activePlayers.forEach((element) => {
        const playerCards = this.cardMap.get(element.playerName);
        const playerCardsFormat = `${playerCards.card1},${playerCards.card2}`;
        for (let i = 0; i < winnersCards.length; i += 1) {
          if (playerCardsFormat === winnersCards[i].cards) {
            winners.push(element);
          }
        }
      });
      winners.forEach((element) => {
        element.stack += pot / winners.length;
      });
      let i = this.activePlayers.length - 1;
      while (i >= 0) {
        if (this.activePlayers[i].invested === 0) {
          this.updatedStacks.set(this.activePlayers[i].playerName, this.activePlayers[i].stack);
          this.activePlayers.splice(i, 1);
        }
        i -= 1;
      }
      pot = 0;
    }
    if (this.activePlayers.length === 1) {
      this.activePlayers[0].stack += this.activePlayers[0].invested;
      this.updatedStacks.set(this.activePlayers[0].playerName, this.activePlayers[0].stack);
    }
    return this.updatedStacks;
  }
}

module.exports = CalculateShowDown;
