import { IDeckConfig } from '../types/deck-config';
import { IValidHands } from '../types/game-config';
import { Card } from './deck';

export function validPokerHand(cards: Array<string>, deckConfig?: IDeckConfig) {
  if (cards.length < 5) {
    return false;
  } // have to have 5 cards
  const mapped = cards.map(card => new Card(card, deckConfig));
  const suitSet = new Set(mapped.map(i => i.suit));
  if (suitSet.size === 1) {
    return true; // flush
  }
  const unitSet = new Set(mapped.map(i => i.unit));
  if (unitSet.size === 2) {
    return true; // full house, 4 of a kind
  }
  // check if it is a straight
  const prioritySet = [...new Set(mapped.map(i => i.pokerPriority))].sort(
    (a, b) => a - b
  );
  if (prioritySet.length < 5) return false;
  let lastValue = prioritySet[0] === 0 ? prioritySet[1] : prioritySet[0];
  let idx = prioritySet[0] === 0 ? 2 : 1;
  for (idx; idx < prioritySet.length; idx += 1) {
    if (lastValue + 1 !== prioritySet[idx]) {
      return false;
    }
    lastValue = prioritySet[idx];
  }
  if (prioritySet[0] === 0) {
    if (lastValue === 12 || prioritySet[1] === 1) {
      // if the ace wraps ie A,2,3,4,5 or A,K,Q,J,10
      return true;
    }
    return false;
  }
  return true;
}

export function validHand(
  cards: Array<string>,
  allowedHands: Array<IValidHands>,
  deckConfig?: IDeckConfig
) {
  if (allowedHands.includes('any')) {
    return true;
  }
  if (cards.length === 1) {
    return allowedHands.includes('1');
  } else if (
    (cards.length === 2 && allowedHands.includes('2')) ||
    (cards.length === 3 && allowedHands.includes('3')) ||
    (cards.length === 4 && allowedHands.includes('4'))
  ) {
    return (
      new Set(cards.map(card => new Card(card, deckConfig).unit)).size === 1
    );
  } else if (cards.length === 5 && allowedHands.includes('poker')) {
    return validPokerHand(cards, deckConfig);
  }
  return false;
}
