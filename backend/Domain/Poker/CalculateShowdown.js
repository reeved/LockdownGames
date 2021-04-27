class CalculateShowDown {
  constructor(board, pokerActivePlayers, cardMap, updatedStacks) {
    this.sortOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.board = board;
    this.pokerActivePlayers = pokerActivePlayers;
    this.cardMap = cardMap;
    this.updatedStacks = updatedStacks;
    this.winningsMap = new Map(); // playerName => new Stack
    this.bestHandMap = new Map(); // playerName => best Hand
    this.pokerActivePlayers.forEach((element) => {
      this.bestHandMap.set(element.playerName, this.evaluateBestHand(element.playerName));
    });
  }

  distributeWinnings() {
    while (this.pokerActivePlayers.length > 1) {
      let pot = 0;
      let minStack = Number.POSITIVE_INFINITY;
      this.pokerActivePlayers.forEach((element) => {
        if (element.invested < minStack) minStack = element.invested; // getting minStack
      });
      pot += minStack * this.pokerActivePlayers.length;
      this.pokerActivePlayers.forEach((element) => {
        element.invested -= minStack;
      });
      const winningHand = this.evaluateWinningHand();
      const winners = [];
      this.pokerActivePlayers.forEach((element) => {
        const hand1 = JSON.stringify(winningHand);
        const hand2 = JSON.stringify(this.bestHandMap.get(element.playerName));
        if (hand1 === hand2) {
          winners.push(element);
        }
      });
      winners.forEach((element) => {
        element.stack += pot / winners.length;
      });
      let i = this.pokerActivePlayers.length - 1;
      while (i > 0) {
        if (this.pokerActivePlayers[i].invested === 0) {
          this.updatedStacks.set(this.pokerActivePlayers[i].playerName, this.pokerActivePlayers[i].stack);
          this.pokerActivePlayers.splice(i, 1);
        }
        i -= 1;
      }
      pot = 0;
    }
    if (this.pokerActivePlayers.length === 1) {
      this.pokerActivePlayers[0].stack += this.pokerActivePlayers[0].invested;
      this.updatedStacks.set(this.pokerActivePlayers[0].playerName, this.pokerActivePlayers[0].stack);
    }
    return this.updatedStacks;
  }

  evaluateWinningHand() {
    let winningHand = {
      justValues: ['2', '3', '4', '5', '7'],
      type: 'high-card',
    };
    this.bestHandMap.forEach((value) => {
      winningHand = this.compareTwoHands(value, winningHand);
    });
    return winningHand;
  }

  evaluateBestHand(playerName) {
    const { card1, card2 } = this.cardMap.get(playerName);
    const extendedBoard = this.board.slice();
    extendedBoard.push(card1);
    extendedBoard.push(card2);
    let bestHand = {
      justValues: ['2', '3', '4', '5', '7'],
      type: 'high-card',
    };
    for (let i = 0; i < 6; i += 1) {
      for (let j = i + 1; j < 7; j += 1) {
        const aHand = [];
        for (let k = 0; k < 7; k += 1) {
          if (k !== i && k !== j) {
            aHand.push(extendedBoard[k]);
          }
        }
        bestHand = this.compareTwoHands(bestHand, this.evaluateHand(aHand));
      }
    }
    return bestHand;
  }

  evaluateHand(theHand) {
    const justValues = theHand.map((s) => s.slice(0, -1));
    justValues.sort((a, b) => this.sortOrder.indexOf(a) - this.sortOrder.indexOf(b));
    const justSuits = theHand.map((s) => s.slice(-1, s.length));

    if (this.checkStraightFlush(justSuits, justValues)) {
      return this.checkStraightFlush(justSuits, justValues);
    }
    if (CalculateShowDown.checkFourOfAKind(justValues)) {
      return CalculateShowDown.checkFourOfAKind(justValues);
    }
    if (CalculateShowDown.checkFullHouse(justValues)) {
      return CalculateShowDown.checkFullHouse(justValues);
    }
    if (CalculateShowDown.checkFlush(justSuits)) {
      return {
        justValues,
        type: 'flush',
      };
    }
    if (this.checkStraight(justValues)) {
      return this.checkStraight(justValues);
    }
    if (CalculateShowDown.checkThreeOfAKind(justValues)) {
      return CalculateShowDown.checkThreeOfAKind(justValues);
    }
    if (CalculateShowDown.checkTwoPair(justValues)) {
      return CalculateShowDown.checkTwoPair(justValues);
    }
    if (CalculateShowDown.checkPair(justValues)) {
      return CalculateShowDown.checkPair(justValues);
    }
    return {
      justValues,
      type: 'high-card',
    };
  }

  compareTwoHands(hand1, hand2) {
    const bestOrder = ['high-card', 'pair', 'two-pair', 'three-of-a-kind', 'straight', 'flush', 'full-house', 'four-of-a-kind', 'straight-flush'];
    if (hand1.type === hand2.type) {
      for (let i = 4; i >= 0; i -= 1) {
        if (hand1.justValues[i] !== hand2.justValues[i]) {
          if (this.sortOrder.indexOf(hand1.justValues[i] > this.sortOrder.indexOf(hand2.justValues[i]))) {
            return hand1;
          }
          return hand2;
        }
      }
      return hand1; // same hand
    }
    if (bestOrder.indexOf(hand1.type) > bestOrder.indexOf(hand2.type)) {
      return hand1;
    }
    return hand2;
  }

  checkStraightFlush(justSuits, justValues) {
    if (CalculateShowDown.checkFlush(justSuits) && this.checkStraight(justValues)) {
      return {
        justValues,
        type: 'straight-flush',
      };
    }
    return null;
  }

  static checkFourOfAKind(justValues) {
    if (justValues[0] === justValues[3]) {
      CalculateShowDown.swapIndex(justValues, 0, 4);
    } else if (justValues[1] === justValues[4]) {
      // empty
    } else {
      return null;
    }
    return {
      justValues,
      type: 'four-of-a-kind',
    };
  }

  static checkFullHouse(justValues) {
    if (justValues[0] === justValues[2] && justValues[3] === justValues[4]) {
      CalculateShowDown.swapIndex(justValues, 0, 4);
      CalculateShowDown.swapIndex(justValues, 1, 3);
    } else if (justValues[0] === justValues[1] && justValues[2] === justValues[4]) {
      // empty
    } else {
      return null;
    }
    return {
      justValues,
      type: 'full-house',
    };
  }

  static checkFlush(justSuits) {
    return justSuits.every((val, i, arr) => val === arr[0]);
  }

  checkStraight(justValues) {
    const wheel = ['2', '3', '4', '5', 'A'];
    if (justValues === wheel) {
      const endCard = justValues.pop();
      justValues.unshift(endCard);
      return {
        justValues,
        type: 'straight',
      };
    }
    for (let i = 1; i < 5; i += 1) {
      if (this.sortOrder.indexOf(justValues[i]) !== this.sortOrder.indexOf(justValues[i - 1]) + 1) {
        return null;
      }
    }
    return {
      justValues,
      type: 'straight',
    };
  }

  static checkThreeOfAKind(justValues) {
    if (justValues[0] === justValues[2]) {
      CalculateShowDown.swapIndex(justValues, 0, 3);
      CalculateShowDown.swapIndex(justValues, 1, 4);
    } else if (justValues[1] === justValues[3]) {
      CalculateShowDown.swapIndex(justValues, 1, 4);
    } else if (justValues[2] === justValues[4]) {
      // empty
    } else {
      return null;
    }
    return {
      justValues,
      type: 'three-of-a-kind',
    };
  }

  static checkTwoPair(justValues) {
    if (justValues[0] === justValues[1] && justValues[2] === justValues[3]) {
      const endCard = justValues.pop();
      justValues.unshift(endCard);
    } else if (justValues[0] === justValues[1] && justValues[3] === justValues[4]) {
      CalculateShowDown.swapIndex(justValues, 0, 2);
    } else if (justValues[1] === justValues[2] && justValues[3] === justValues[4]) {
      // empty
    } else {
      return null;
    }
    return {
      justValues,
      type: 'two-pair',
    };
  }

  static checkPair(justValues) {
    if (justValues[0] === justValues[1]) {
      const pair = justValues.splice(0, 2);
      justValues.push(pair);
    } else if (justValues[1] === justValues[2]) {
      CalculateShowDown.swapIndex(justValues, 1, 3);
      CalculateShowDown.swapIndex(justValues, 2, 4);
    } else if (justValues[2] === justValues[3]) {
      CalculateShowDown.swapIndex(justValues, 2, 4);
      CalculateShowDown.swapIndex(justValues, 3, 4);
    } else if (justValues[3] === justValues[4]) {
      // empty
    } else {
      return false;
    }
    return {
      justValues,
      type: 'pair',
    };
  }

  static swapIndex(array, index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }
}

module.exports = CalculateShowDown;
