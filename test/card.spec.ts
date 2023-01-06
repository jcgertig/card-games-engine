import { deuces } from '../src/games';
import { Card } from '../src/logic/deck';

describe('Card class', () => {
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
