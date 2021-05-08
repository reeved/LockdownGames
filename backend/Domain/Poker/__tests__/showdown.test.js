/* eslint-disable jest/no-focused-tests */
import CalculateShowDown from '../CalculateShowdown';
import PokerActivePlayer from '../PokerActivePlayer';

it('test distribute', async () => {
  const board = ['2H', '2D', '10S', '6S', '7D'];
  const pokerActivePlayers = [new PokerActivePlayer('Ben', 1000, 'B123'), new PokerActivePlayer('A', 200, 'A123')];
  pokerActivePlayers[0].invested = 100;
  pokerActivePlayers[1].invested = 50;
  const cardMap = new Map();
  cardMap.set('Ben', { card1: 'AD', card2: 'AH' });
  cardMap.set('A', { card1: '5D', card2: '8C' });
  const showdown = new CalculateShowDown(board, pokerActivePlayers, [], [], cardMap, new Map());
  const updatedStacks = await showdown.distributeWinnings();
  expect(updatedStacks.get('Ben')).toBe(1150);
  expect(updatedStacks.get('A')).toBe(200);
});

// eslint-disable-next-line jest/no-focused-tests
it('test distribute split', async () => {
  const board = ['2H', '3D', '4S', '5S', '6D'];
  const pokerActivePlayers = [new PokerActivePlayer('Ben', 1000, 'B123'), new PokerActivePlayer('A', 200, 'A123')];
  pokerActivePlayers[0].invested = 100;
  pokerActivePlayers[1].invested = 50;
  const cardMap = new Map();
  cardMap.set('Ben', { card1: 'AD', card2: 'AH' });
  cardMap.set('A', { card1: '5D', card2: '8C' });
  const showdown = new CalculateShowDown(board, pokerActivePlayers, [], [], cardMap, new Map());
  const updatedStacks = await showdown.distributeWinnings();
  expect(updatedStacks.get('Ben')).toBe(1100);
  expect(updatedStacks.get('A')).toBe(250);
});

it('test fetch api', async () => {
  const cardMap = new Map();
  cardMap.set('Ben', { card1: 'AD', card2: 'AH' });
  cardMap.set('A', { card1: '5D', card2: '8C' });
  const result = await CalculateShowDown.fetchFromPokerApi(['2H', '3D', '4S', '5S', '6D'], cardMap);
  expect(result).not.toBe(null);
  expect(result.winners).toHaveLength(2);
  expect(result.winners[0].hand).toEqual(result.winners[1].hand);
});
