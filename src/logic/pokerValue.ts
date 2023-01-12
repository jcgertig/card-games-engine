import { validStraight } from './checkHand';
import { Card } from './deck';

export const handBaseValue = {
  highCard: 0,
  pair: 150,
  twoPair: 300,
  threeOfAKind: 450,
  straight: 600,
  flush: 750,
  fullHouse: 900,
  fourOfAKind: 1050,
  straightFlush: 1200,
  royalFlush: 1350,
};

// [ '10C', '10H' ] vs [ '4S', '4C' ]
// [ '2D', '8D', '2C', '8H', '2H' ] vs [ '8C', '10C', '10H', '8S', '10D' ]

function isStraight(cards: Array<Card>) {
  try {
    return validStraight(cards);
  } catch (err) {
    return false;
  }
}

export function pokerValue(cards: Array<Card>) {
  const maxValue = Math.max(...cards.map(i => i.value));
  if (cards.length < 5) {
    return maxValue;
  }

  const suitSet = new Set(cards.map(i => i.suit));
  const unitSet = cards.reduce((acc, i) => {
    acc.set(i.unit, (acc.get(i.unit) || 0) + 1);
    return acc;
  }, new Map<string, number>());
  if (suitSet.size === 1) {
    if (isStraight(cards)) {
      if (
        cards.filter(i => i.pokerPriority === 0 || i.pokerPriority === 1)
          .length === 2
      ) {
        // royal flush
        return handBaseValue.royalFlush + maxValue;
      }
      // straight flush
      return handBaseValue.straightFlush + maxValue;
    }
    // flush
    return handBaseValue.flush + maxValue;
  }
  if (unitSet.size === 2) {
    if (Math.max(...unitSet.values()) === 4) {
      // four of a kind
      return handBaseValue.fourOfAKind + maxValue;
    }
    // full house
    return handBaseValue.fullHouse + maxValue;
  }
  if (Math.max(...unitSet.values()) === 3) {
    // three of a kind
    return handBaseValue.threeOfAKind + maxValue;
  }
  const countPairs = [...unitSet.values()].filter(i => i === 2).length;
  if (countPairs === 2) {
    // two pair
    return handBaseValue.twoPair + maxValue;
  }
  if (countPairs === 1) {
    // pair
    return handBaseValue.pair + maxValue;
  }
  if (isStraight(cards)) {
    // straight
    return handBaseValue.straight + maxValue;
  }
  // high card
  return handBaseValue.highCard + maxValue;
}
