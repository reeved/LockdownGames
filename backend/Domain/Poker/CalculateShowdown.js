/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
class CalculateShowDown {
  constructor(board, arrayOfHands, arrayOfPlayerNames, pot) {
    this.sortOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.result = 'PLACEHOLDER';
    this.pot = pot;
    this.bestHand = null;
    this.arrangeTheShowDown(board, arrayOfHands, arrayOfPlayerNames);
  }

  arrangeTheShowDown(board, arrayOfHands, arrayOfPlayerNames) {
    const arrayOfBestHands = [];
    for (let i = 0; i < arrayOfHands.length; i += 1) {
      const hand = arrayOfHands[i];
      this.playerName = arrayOfPlayerNames[i];
      const extendedBoard = [...board, hand[0], hand[1]];
      console.log(`${this.sortOrderplayerName}:`);
      const bestHandForOnePlayer = this.getBestHandForOnePlayer(extendedBoard, this.playerName);
      console.log(bestHandForOnePlayer);
      arrayOfBestHands.push(bestHandForOnePlayer);
    }
    // eslint-disable-next-line prefer-destructuring
    this.bestHand = arrayOfBestHands[0];
    console.log(arrayOfBestHands);
    for (let i = 0; i < arrayOfBestHands.length; i += 1) {
      this.playerName = arrayOfPlayerNames[i];
      const hand = arrayOfBestHands[i];
      this.compareTwoHands(hand);
    }
    this.result = {
      message: `The winning hand is ${this.bestHand.playerName}: ${this.bestHand.hand} with a ${this.bestHand.type} they have won a pot of ${this.pot}`,
      winningName: this.bestHand.playerName,
      pot: this.pot,
    };
  }

  getBestHandForOnePlayer(extendedBoard, playerName) {
    this.bestHand = {
      type: 'HighCard',
      hand: ['2', '3', '4', '5', '7'], // rated of importance (left ot right)
      playerName,
    };

    for (let i = 0; i < 6; i += 1) {
      // [ the first 6 cards]
      for (let j = i + 1; j < 7; j += 1) {
        // [the rest ]
        const potentialHand = [];
        for (let k = 0; k < 7; k += 1) {
          if (k !== i && k !== j) {
            potentialHand.push(extendedBoard[k]);
          }
        }

        const justValues = this.calculateJustValues(potentialHand);
        this.calculateValue(potentialHand, justValues);
      }
    }
    return this.bestHand;
  }

  calculateJustValues(hand) {
    const justValues = [];
    for (const card of hand) {
      justValues.push(card.substring(0, card.length - 1));
    }
    justValues.sort((a, b) => this.sortOrder.indexOf(a) - this.sortOrder.indexOf(b));
    return justValues;
  }

  calculateValue(potentialHand, justValues) {
    if (this.checkFlush(potentialHand) && this.checkStraight(justValues)) {
      this.bestHand.type = 'StraightFlush';
    } else if (
      this.checkFourOfAKind(justValues) ||
      this.checkFullHouse(justValues) ||
      this.checkStraight(justValues) ||
      this.checkThreeOfAKind(justValues) ||
      this.checkTwoPair(justValues) ||
      this.checkPair(justValues) ||
      this.checkHighCard(justValues)
      // eslint-disable-next-line no-empty
    ) {
    }
    // console.log("The best combo for this hand is" + this.bestHand.type)
    // console.log("the best hand is : " + this.bestHand.hand  )
  }

  compareTwoHands(competingHand) {
    // type. hand
    competingHand.playerName = this.playerName;
    const bestOrder = ['HighCard', 'Pair', 'TwoPair', 'ThreeOfAKind', 'Straight', 'Flush', 'FullHouse', 'FourOfAKind', 'StraightFlush'];
    if (competingHand.type === this.bestHand.type) {
      // compare Hands
      for (let i = 4; i >= 0; i -= 1) {
        if (this.sortOrder.indexOf(competingHand.hand[i]) > this.sortOrder.indexOf(this.bestHand.hand[i])) {
          this.bestHand = competingHand;
        } else if (this.sortOrder.indexOf(competingHand.hand[i]) < this.sortOrder.indexOf(this.bestHand.hand[i])) {
          return;
        }
      }
    } else if (bestOrder.indexOf(competingHand.type) > bestOrder.indexOf(this.bestHand.type)) {
      this.bestHand = competingHand;
    }
  }

  checkFourOfAKind(justValues) {
    const competingHand = {
      type: 'FourOfAKind',
      hand: null,
    };
    if (justValues[0] === justValues[3]) {
      this.swapIndex(justValues, 0, 4);
      competingHand.hand = justValues;
    } else if (justValues[1] === justValues[4]) {
      competingHand.hand = justValues;
    } else {
      return false;
    }
    this.compareTwoHands(competingHand);
    return true;
  }

  checkFullHouse(justValues) {
    const competingHand = {
      type: 'FullHouse',
      hand: null,
    };
    if (justValues[0] === justValues[2] && justValues[3] === justValues[4]) {
      this.swapIndex(justValues, 0, 4);
      this.swapIndex(justValues, 1, 3);
      competingHand.hand = justValues;
    } else if (justValues[0] === justValues[1] && justValues[2] === justValues[4]) {
      competingHand.hand = justValues;
    } else {
      return false;
    }
    this.compareTwoHands(competingHand);
    return true;
  }

  checkFlush(hand, justValues) {
    const suit = hand[0].slice(-1);
    for (const card of hand) {
      if (card.slice(-1) !== suit) {
        return false;
      }
    }
    const competingHand = {
      type: 'Flush',
      hand: justValues,
    };
    this.compareTwoHands(competingHand);
    return true;
  }

  checkStraight(justValues) {
    const competingHand = {
      type: 'Straight',
      hand: null,
    };
    const noDups = new Set(justValues);
    if (justValues.length === noDups.size && this.sortOrder.indexOf(justValues[4]) === this.sortOrder.indexOf(justValues[0]) + 4) {
      competingHand.hand = justValues;
    } else if (justValues.length === noDups.size && justValues[0] === '2' && justValues[3] === '5' && justValues[4] === 'A') {
      const endCard = justValues.pop();
      justValues.unshift(endCard);
      competingHand.hand = justValues;
    } else {
      return false;
    }
    this.compareTwoHands(competingHand);
    return true;
  }

  checkThreeOfAKind(justValues) {
    const competingHand = {
      type: 'ThreeOfAKind',
      hand: null,
    };
    if (justValues[0] === justValues[2]) {
      this.swapIndex(justValues, 0, 3);
      this.swapIndex(justValues, 1, 4);
    } else if (justValues[1] === justValues[3]) {
      this.swapIndex(justValues, 1, 4);
      // eslint-disable-next-line no-empty
    } else if (justValues[2] === justValues[4]) {
    } else {
      return false;
    }
    competingHand.hand = justValues;
    this.compareTwoHands(competingHand);
    return true;
  }

  checkTwoPair(justValues) {
    const competingHand = {
      type: 'TwoPair',
      hand: null,
    };
    if (justValues[0] === justValues[1] && justValues[2] === justValues[3]) {
      const endCard = justValues.pop();
      justValues.unshift(endCard);
    } else if (justValues[0] === justValues[1] && justValues[3] === justValues[4]) {
      this.swapIndex(justValues, 0, 2);
      // eslint-disable-next-line no-empty
    } else if (justValues[1] === justValues[2] && justValues[3] === justValues[4]) {
    } else {
      return false;
    }
    competingHand.hand = justValues;
    this.compareTwoHands(competingHand);
    return true;
  }

  checkPair(justValues) {
    const competingHand = {
      type: 'Pair',
      hand: null,
    };
    if (justValues[0] === justValues[1]) {
      const pair = justValues.splice(0, 2);
      justValues.push(pair);
    } else if (justValues[1] === justValues[2]) {
      this.swapIndex(justValues, 1, 3);
      this.swapIndex(justValues, 2, 4);
    } else if (justValues[2] === justValues[3]) {
      this.swapIndex(justValues, 2, 4);
      this.swapIndex(justValues, 3, 4);
      // eslint-disable-next-line no-empty
    } else if (justValues[3] === justValues[4]) {
    } else {
      return false;
    }
    competingHand.hand = justValues;
    this.compareTwoHands(competingHand);
    return true;
  }

  checkHighCard(justValues) {
    const competingHand = {
      type: 'HighCard',
      hand: justValues,
    };
    competingHand.hand = justValues;
    this.compareTwoHands(competingHand);
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  swapIndex(array, index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  getResult() {
    return this.result;
  }
}

module.exports = CalculateShowDown;
