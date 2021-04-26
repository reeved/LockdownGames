import Game from '../Game';
import PokerPlayer from '../PokerPlayer';
import PokerActivePlayer from '../PokerActivePlayer';
import GameState from '../GameState';

let game = null;

beforeEach(() => {
  let players = [
    { nickname: 'A', socketID: 'A123' },
    { nickname: 'B', socketID: 'B123' },
    { nickname: 'C', socketID: 'C123' },
  ];
  game = new Game(players);
});

it('testing initialising gameState', () => {
  let expected = [new PokerPlayer('A', 1000, 'A123'), new PokerPlayer('B', 1000, 'B123'), new PokerPlayer('C', 1000, 'C123')];
  expect(game.gameState.playerState).toEqual(expected);
});

it('testing creating poker round', () => {
  game.createPokerRound();
  let expected = [new PokerActivePlayer('A', 1000, 'A123'), new PokerActivePlayer('B', 1000, 'B123'), new PokerActivePlayer('C', 1000, 'C123')];
  expect(game.pokerRound.pokerActivePlayers).toEqual(expected);
});

it('creating poker round one busted', () => {
  game.gameState.playerState[1].stack = 0;
  game.createPokerRound();
  let expected = [new PokerActivePlayer('A', 1000, 'A123'), new PokerActivePlayer('C', 1000, 'C123')];
  expect(game.pokerRound.pokerActivePlayers).toEqual(expected);
});

it('testing initialising holecards', () => {
  game.createPokerRound();
  let { socketID, card1, card2 } = game.generateHoleCards();
  expect(game.deck.getSize()).toBe(46);
  expect(game.cardMap.size).toBe(3);
});

it('testing initialising blinds 2 players', () => {
  game.gameState.playerState[0].stack = 0; // a is busted
  game.createPokerRound();
  let pokerRound = game.handlePlayStart();
  let onActionPlayer = pokerRound.pokerActivePlayers[0];
  expect(onActionPlayer.currentBet).toBe(10);
  expect(onActionPlayer.currentAction).toBe('onAction');
  let bigBlindPlayer = pokerRound.pokerActivePlayers[1];
  expect(bigBlindPlayer.currentBet).toBe(20);
});

it('testing initialising blinds 3 players', () => {
  game.createPokerRound();
  let pokerRound = game.handlePlayStart();
  let onActionPlayer = pokerRound.pokerActivePlayers[0];
  expect(onActionPlayer.currentBet).toBe(0);
  expect(onActionPlayer.currentAction).toBe('onAction');
  let smallBlindPlayer = pokerRound.pokerActivePlayers[1];
  expect(smallBlindPlayer.currentBet).toBe(10);
  let bigBlindPlayer = pokerRound.pokerActivePlayers[2];
  expect(bigBlindPlayer.currentBet).toBe(20);
});

it('testing handleFold 3 players', () => {
  game.createPokerRound();
  let pokerRound = game.handlePlayStart();
  pokerRound = game.handleFold();
  expect(pokerRound.updatedStacks.get('A')).toBe(1000);
  expect(pokerRound.dealerIndex).toBe(-1);
  expect(pokerRound.pokerActivePlayers[0].currentAction).toBe('onAction');
});

it('testing handleFold 2 players', () => {
  game.gameState.playerState[0].stack = 0; // a is busted
  game.createPokerRound();
  let pokerRound = game.handlePlayStart();
  let gameState = game.handleFold();
  expect(gameState instanceof GameState).toBe(true);
  expect(gameState.playerState[1].stack).toBe(990);
  expect(gameState.playerState[2].stack).toBe(1010);
});
