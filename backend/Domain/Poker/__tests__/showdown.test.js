import CalculateShowDown from '../CalculateShowdown';
import PokerActivePlayer from '../PokerActivePlayer';

it('test distribute', () => {
  const board = ['2H', '2D', '10S', '6S', '7D'];
  const pokerActivePlayers = [new PokerActivePlayer('Ben', 1000, 'B123'), new PokerActivePlayer('A', 200, 'A123')];
  pokerActivePlayers[0].invested = 100;
  pokerActivePlayers[1].invested = 50;
  const cardMap = new Map();
  cardMap.set('Ben', { card1: 'AD', card2: 'AH' });
  cardMap.set('A', { card1: '5D', card2: '8C' });
  const showdown = new CalculateShowDown(board, pokerActivePlayers, [], [], cardMap, new Map());
  const updatedStacks = showdown.distributeWinnings();
  expect(updatedStacks.get('Ben')).toBe(1150);
  expect(updatedStacks.get('A')).toBe(200);
});

it('test showdown - four of a kind', () => {
  const { justValues, type } = CalculateShowDown.checkFourOfAKind(['3', '3', '3', '3', '10']);
  expect(justValues).toStrictEqual(['10', '3', '3', '3', '3']);
  expect(type).toBe('four-of-a-kind');
});

it('test showdown - flush', () => {
  const isFlush = CalculateShowDown.checkFlush(['S', 'S', 'S', 'S', 'S']);
  expect(isFlush).toBe(true);
});

it('test showdown - flush fail', () => {
  const isFlush = CalculateShowDown.checkFlush(['D', 'S', 'S', 'S', 'S']);
  expect(isFlush).toBe(false);
});

it('test showdown - twoPair', () => {
  const { justValues, type } = CalculateShowDown.checkTwoPair(['2', '2', '3', 'K', 'K']);
  expect(justValues).toStrictEqual(['3', '2', '2', 'K', 'K']);
  expect(type).toBe('two-pair');
});

// eslint-disable-next-line jest/no-focused-tests
it('test distribute split', () => {
  const board = ['2H', '3D', '4S', '5S', '6D'];
  const pokerActivePlayers = [new PokerActivePlayer('Ben', 1000, 'B123'), new PokerActivePlayer('A', 200, 'A123')];
  pokerActivePlayers[0].invested = 100;
  pokerActivePlayers[1].invested = 50;
  const cardMap = new Map();
  cardMap.set('Ben', { card1: 'AD', card2: 'AH' });
  cardMap.set('A', { card1: '5D', card2: '8C' });
  const showdown = new CalculateShowDown(board, pokerActivePlayers, [], [], cardMap, new Map());
  const updatedStacks = showdown.distributeWinnings();
  expect(updatedStacks.get('Ben')).toBe(1100);
  expect(updatedStacks.get('A')).toBe(250);
});
