import Player from '../../Player';
import Deck from '../../Poker/Deck';
import Game from '../Game';
import LastCardPlayer from '../LastCardPlayer';

let game = null;

beforeEach(() => {
  const players = [new Player('A', 'A123', '1234', true), new Player('B', 'B123', '1234', false), new Player('C', 'C123', '1234', false)];
  game = new Game(players);
});

it('Testing last Card hand', () => {
  const deck = new Deck();
  deck.setDeck();
  const hand = deck.getLastCardHand();

  expect(hand).toHaveLength(7);
});

it('Testing game initiating', () => {
  const expected = [new LastCardPlayer('A', 'A123'), new LastCardPlayer('B', 'B123'), new LastCardPlayer('C', 'C123')];
  expect(game.players).toEqual(expected);
});
