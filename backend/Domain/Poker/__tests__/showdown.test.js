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
