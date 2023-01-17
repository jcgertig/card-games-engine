import { last } from 'lodash';
import { IDeckConfig, PokerCards } from '../types/deck-config';
import {
  IValidHands,
  IValidHandSetStruct,
  IValidHandStraightStruct,
  IValidHandStruct,
} from '../types/game-config';
import { Card } from './deck';

export const POKER_JOKER = 'Joker';

/**
 * Checks if a list of cards is a valid straight
 * @param cards Card[]
 * @param wildCard A poker card or null if wilds are not supported
 * @param wildCardMaxGap the max number of wild cards allowed together. Null means no max, defaults to 1
 * @returns boolean
 */
export function validStraight(
  cards: Card[],
  wildCard: PokerCards | null = null,
  wildCardMaxGap: number | null = 1
) {
  if (cards.length === 0) return false;

  const { pokerPriority, wildCount } = cards.reduce(
    (res, entry) => {
      if (entry.name === POKER_JOKER || entry.unit === wildCard)
        res.wildCount = res.wildCount + 1;
      else res.pokerPriority.add(entry.pokerPriority);
      return res;
    },
    { pokerPriority: new Set(), wildCount: 0 } as {
      pokerPriority: Set<number>;
      wildCount: number;
    }
  );

  const prioritySet = [...pokerPriority]
    .sort((a, b) => a - b)
    .filter(i => i >= 0);

  if (prioritySet.length === 0) throw new Error('Can not play only wild cards');
  if (wildCount === 0 && prioritySet.length !== cards.length)
    throw new Error('Can not have sets in a straight');

  const highAce = prioritySet[0] === 0 && last(prioritySet)! > 4;
  if (highAce) {
    prioritySet.shift();
    prioritySet.push(13);
  }
  let lastValue = prioritySet[0];
  let gapCount = 0;
  let gapCountTotal = 0;

  for (let idx = 1; idx < prioritySet.length; idx += 1) {
    if (lastValue + 1 !== prioritySet[idx]) {
      const diff = prioritySet[idx] - lastValue - 1;
      if (wildCount > 0) {
        gapCountTotal += diff;
        gapCount += diff;

        if (gapCountTotal > wildCount)
          throw new Error('Not enough wild card(s) to fill the gaps');
        if (typeof wildCardMaxGap === 'number' && gapCount > wildCardMaxGap)
          throw new Error(
            `Can not have more than ${wildCardMaxGap} wild card(s) in a row`
          );
      } else {
        throw new Error('Missing cards for a valid straight');
      }
    } else {
      gapCount = 0;
    }
    lastValue = prioritySet[idx];
  }

  return true;
}

/**
 * Checks if a list of cards is a valid flush
 * @param cards Card[]
 * @param wildCard A poker card or null if wilds are not supported
 * @returns boolean
 */
export function validFlush(cards: Card[], wildCard: PokerCards | null = null) {
  const suitSet = cards.reduce((res, entry) => {
    if (entry.name !== POKER_JOKER && entry.unit !== wildCard)
      res.add(entry.suit);
    return res;
  }, new Set<string>());

  return suitSet.size === 1;
}

/**
 * Checks if a list of cards is a valid full house
 * @param cards Card[]
 * @param wildCard A poker card or null if wilds are not supported
 * @returns boolean
 */
export function validFullHouse(
  cards: Card[],
  wildCard: PokerCards | null = null
) {
  const unitSet = cards.reduce((res, entry) => {
    if (entry.name !== POKER_JOKER && entry.unit !== wildCard)
      res.add(entry.unit);
    return res;
  }, new Set<string>());

  return unitSet.size === 2;
}

export function validPokerHand(cards: Array<string>, deckConfig?: IDeckConfig) {
  if (cards.length < 5) return false; // have to have 5 cards
  const mapped = cards.map(card => new Card(card, deckConfig));
  const wildCard = (deckConfig as any)?.wildCard;
  if (validFlush(mapped, wildCard)) return true; // flush
  if (validFullHouse(mapped, wildCard)) return true; // full house, 4 of a kind
  return validStraight(mapped, wildCard, (deckConfig as any)?.wildCardMaxGap); // straight
}

export function matchSetRules(count: number, rules: IValidHandSetStruct[]) {
  return rules.some(rule => {
    if (rule.count === count) return true;
    if (count > rule.count && rule.allowMore) return true;
    return false;
  });
}

export function matchStraightRules(
  cards: Card[],
  flush: boolean,
  rules: IValidHandStraightStruct[]
) {
  return rules.some(rule => {
    if (rule.count === cards.length) return rule.flush ? flush : true;
    if (cards.length > rule.count && rule.allowMore)
      return rule.flush ? flush : true;
    return false;
  });
}

/**
 * Checks if a list of cards is a valid play
 * @param cards list of card names
 * @param allowedHands list of hand types that are allowed
 * @param deckConfig used for wildcard and card values
 * @returns boolean
 */
export function validHand(
  cards: Array<string>,
  allowedHands: Array<IValidHands>,
  deckConfig?: IDeckConfig
) {
  return evaluateHandType(cards, allowedHands, deckConfig) !== 'none';
}

/**
 * Checks if a hand is valid and return the type it is
 * @param cards
 * @param allowedHands
 * @param deckConfig
 * @returns 'none' | 'any' | 'set' | 'straight' | 'poker'
 */
export function evaluateHandType(
  cards: Array<string>,
  allowedHands: Array<IValidHands>,
  deckConfig?: IDeckConfig
) {
  if (allowedHands.includes('any')) return 'any';

  const wildCard = (deckConfig as any)?.wildCard;

  const structs = allowedHands.reduce(
    (res, entry) => {
      if (typeof entry === 'string') {
        const count = Number(entry);
        if (!isNaN(count))
          res.set.push({ kind: 'set', count, allowMore: false });
      } else if (typeof entry === 'number') {
        res.set.push({ kind: 'set', count: entry, allowMore: false });
      } else {
        res[entry.kind].push(entry);
      }
      return res;
    },
    { set: [], straight: [] } as {
      set: IValidHandStruct[];
      straight: IValidHandStruct[];
    }
  );

  const mapped = cards.reduce(
    (res, entry) => {
      const card = new Card(entry, deckConfig);
      if (card.name !== POKER_JOKER && card.unit !== wildCard) {
        res.units.add(card.unit);
        res.suits.add(card.suit);
      }
      res.cards.push(card);
      return res;
    },
    { units: new Set(), suits: new Set(), cards: [] } as {
      units: Set<string>;
      suits: Set<string>;
      cards: Card[];
    }
  );

  if (structs.set.length > 0 && mapped.units.size === 1)
    return matchSetRules(cards.length, structs.set as IValidHandSetStruct[])
      ? 'set'
      : 'none';

  if (
    structs.straight.length > 0 &&
    validStraight(mapped.cards, wildCard, (deckConfig as any)?.wildCardMaxGap)
  )
    return matchStraightRules(
      mapped.cards,
      mapped.suits.size === 1,
      structs.straight as IValidHandStraightStruct[]
    )
      ? 'straight'
      : 'none';

  if (cards.length === 5 && allowedHands.includes('poker'))
    return validPokerHand(cards, deckConfig) ? 'poker' : 'none';

  return 'none';
}
