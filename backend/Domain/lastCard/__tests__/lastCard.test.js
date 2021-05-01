import Deck from '../../Poker/Deck';

it('Testing last Card hand', () => {
  const deck = new Deck();
  const hand = deck.getLastCardHand();

  expect(hand).toHaveLength(7);
});
