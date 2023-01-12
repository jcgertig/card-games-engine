import { bids, deuces, hearts } from '../src/games';
import { Card } from '../src/logic/deck';

describe('Card class (deuces)', () => {
  let card = new Card('2H', deuces.deck);

  beforeEach(() => {
    card = new Card('2H', deuces.deck);
  });

  test('create new Card', () => {
    expect(card).toBeInstanceOf(Card);
  });

  test('has lists suit as H', () => {
    expect(card.suit).toEqual('H');
  });

  test('has unit of 2', () => {
    expect(card.unit).toEqual('2');
  });

  test('has unit priority of 0', () => {
    expect(card.unitPriority).toEqual(0);
  });

  test('has suit priority of 1', () => {
    expect(card.suitPriority).toEqual(1);
  });

  test('has poker priority of 12', () => {
    expect(card.pokerPriority).toEqual(12);
  });

  test('has value of 122', () => {
    expect(card.value).toEqual(122);
  });

  test('has point value of 0', () => {
    expect(card.pointValue).toEqual(0);
  });

  test('has name of 2H', () => {
    expect(card.name).toEqual('2H');
  });

  test('has unit of 10', () => {
    card = new Card('10S', deuces.deck);
    expect(card.unit).toEqual('10');
  });

  test('value of 10S > 10H', () => {
    card = new Card('10S', deuces.deck);
    const card2 = new Card('10H', deuces.deck);
    expect(card.value).toBeGreaterThan(card2.value);
  });

  test('value of 10S > 9H', () => {
    card = new Card('10S', deuces.deck);
    const card2 = new Card('9H', deuces.deck);
    expect(card.value).toBeGreaterThan(card2.value);
  });
});

describe('Card class (bids)', () => {
  let card = new Card('2H', bids.deck);

  beforeEach(() => {
    card = new Card('2H', bids.deck);
  });

  test('create new Card', () => {
    expect(card).toBeInstanceOf(Card);
  });

  test('has lists suit as H', () => {
    expect(card.suit).toEqual('H');
  });

  test('has unit of 2', () => {
    expect(card.unit).toEqual('2');
  });

  test('has unit priority of 12', () => {
    expect(card.unitPriority).toEqual(12);
  });

  test('has suit priority of 1', () => {
    expect(card.suitPriority).toEqual(1);
  });

  test('has poker priority of 12', () => {
    expect(card.pokerPriority).toEqual(12);
  });

  test('has value of 2', () => {
    expect(card.value).toEqual(2);
  });

  test('has point value of 0', () => {
    expect(card.pointValue).toEqual(0);
  });

  test('has name of 2H', () => {
    expect(card.name).toEqual('2H');
  });

  test('has unit of 10', () => {
    card = new Card('10S', bids.deck);
    expect(card.unit).toEqual('10');
  });

  test('value of 10S > 10H', () => {
    card = new Card('10S', bids.deck);
    const card2 = new Card('10H', bids.deck);
    expect(card.value).toBeGreaterThan(card2.value);
  });

  test('value of 10S > 9H', () => {
    card = new Card('10S', bids.deck);
    const card2 = new Card('9H', bids.deck);
    expect(card.value).toBeGreaterThan(card2.value);
  });
});

describe('Card class (hearts)', () => {
  let card = new Card('2H', hearts.deck);

  beforeEach(() => {
    card = new Card('2H', hearts.deck);
  });

  test('create new Card', () => {
    expect(card).toBeInstanceOf(Card);
  });

  test('has lists suit as H', () => {
    expect(card.suit).toEqual('H');
  });

  test('has unit of 2', () => {
    expect(card.unit).toEqual('2');
  });

  test('has unit priority of 12', () => {
    expect(card.unitPriority).toEqual(12);
  });

  test('has suit priority of 0', () => {
    expect(card.suitPriority).toEqual(0);
  });

  test('has poker priority of 12', () => {
    expect(card.pokerPriority).toEqual(12);
  });

  test('has value of 3', () => {
    expect(card.value).toEqual(3);
  });

  test('has point value of 1', () => {
    expect(card.pointValue).toEqual(1);
  });

  test('has name of 2H', () => {
    expect(card.name).toEqual('2H');
  });

  test('has unit of 10', () => {
    card = new Card('10S', bids.deck);
    expect(card.unit).toEqual('10');
  });

  test('value of 10S > 10H', () => {
    card = new Card('10S', bids.deck);
    const card2 = new Card('10H', bids.deck);
    expect(card.value).toBeGreaterThan(card2.value);
  });

  test('value of 10S > 9H', () => {
    card = new Card('10S', bids.deck);
    const card2 = new Card('9H', bids.deck);
    expect(card.value).toBeGreaterThan(card2.value);
  });
});

describe('Card class - hwatu', () => {
  let card = new Card('2H', { type: 'hwatu' });

  beforeEach(() => {
    card = new Card('2H', { type: 'hwatu' });
  });

  test('create new Card', () => {
    expect(card).toBeInstanceOf(Card);
  });

  test('has lists suit as ""', () => {
    expect(card.suit).toEqual('');
  });

  test('has unit of ""', () => {
    expect(card.unit).toEqual('');
  });

  test('has unit priority of 0', () => {
    expect(card.unitPriority).toEqual(0);
  });

  test('has suit priority of 0', () => {
    expect(card.suitPriority).toEqual(0);
  });

  test('has poker priority of 0', () => {
    expect(card.pokerPriority).toEqual(0);
  });

  test('has value of 0', () => {
    expect(card.value).toEqual(0);
  });

  test('has point value of 0', () => {
    expect(card.pointValue).toEqual(0);
  });

  test('has name of 2H', () => {
    expect(card.name).toEqual('2H');
  });
});
