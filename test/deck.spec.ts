import { bids, deuces, hearts } from '../src/games';
import { Deck } from '../src/logic/deck';

describe('Deck class (deuces)', () => {
  let deck = new Deck(deuces.deck);

  beforeEach(() => {
    deck = new Deck(deuces.deck);
    deck.shuffle();
  });

  test('create new Deck', () => {
    expect(deck).toBeInstanceOf(Deck);
  });

  test('deal one card', () => {
    const dealt = deck.deal({ perPerson: 1 }, 1);
    expect(dealt.players.length).toEqual(1);
    expect(dealt.players[0].length).toEqual(1);
  });

  test('deal cards evenly among 4 people', () => {
    const dealt = deck.deal({ perPerson: 'even' }, 4);
    expect(dealt.players.length).toEqual(4);
    expect(dealt.players[0].length).toEqual(13);
  });
});

describe('Deck class (bids)', () => {
  let deck = new Deck(bids.deck);

  beforeEach(() => {
    deck = new Deck(bids.deck);
  });

  test('create new Deck', () => {
    expect(deck).toBeInstanceOf(Deck);
  });

  test('deal one card', () => {
    const dealt = deck.deal({ perPerson: 1 }, 1);
    expect(dealt.players.length).toEqual(1);
    expect(dealt.players[0].length).toEqual(1);
  });

  test('deal cards evenly among 4 people', () => {
    const dealt = deck.deal({ perPerson: 'even' }, 4);
    expect(dealt.players.length).toEqual(4);
    expect(dealt.players[0].length).toEqual(13);
  });
});

describe('Deck class (hearts)', () => {
  let deck = new Deck(hearts.deck);

  beforeEach(() => {
    deck = new Deck(hearts.deck);
  });

  test('create new Deck', () => {
    expect(deck).toBeInstanceOf(Deck);
  });

  test('deal one card', () => {
    const dealt = deck.deal({ perPerson: 1 }, 1);
    expect(dealt.players.length).toEqual(1);
    expect(dealt.players[0].length).toEqual(1);
  });

  test('deal cards evenly among 4 people', () => {
    const dealt = deck.deal({ perPerson: 'even' }, 4);
    expect(dealt.players.length).toEqual(4);
    expect(dealt.players[0].length).toEqual(13);
  });
});

describe('Deck class - poker type', () => {
  let deck = new Deck();

  beforeEach(() => {
    deck = new Deck();
  });

  test('create new Deck', () => {
    expect(deck).toBeInstanceOf(Deck);
  });

  test('deal one card', () => {
    const dealt = deck.deal({ perPerson: 1 }, 1);
    expect(dealt.players.length).toEqual(1);
    expect(dealt.players[0].length).toEqual(1);
  });

  test('deal cards evenly among 4 people', () => {
    const dealt = deck.deal({ perPerson: 'even' }, 4);
    expect(dealt.players.length).toEqual(4);
    expect(dealt.players[0].length).toEqual(13);
  });

  test('deal one card from 2 decks', () => {
    deck = new Deck({ count: 2, type: 'poker' });
    deck.shuffle();
    const dealt = deck.deal({ perPerson: 1 }, 1);
    expect(dealt.players.length).toEqual(1);
    expect(dealt.players[0].length).toEqual(1);
    expect(deck.cardsLeft.length).toBe(103);
  });

  test('deal one card to table', () => {
    const dealt = deck.deal({ toTable: 1 }, 1);
    expect(dealt.players.length).toEqual(1);
    expect(dealt.players[0].length).toEqual(0);
    expect(dealt.table.length).toEqual(1);
    expect(deck.cardsLeft.length).toBe(51);
  });
});

describe('Deck class - hwatu type', () => {
  let deck = new Deck({ type: 'hwatu' });

  beforeEach(() => {
    deck = new Deck({ type: 'hwatu' });
  });

  test('create new Deck', () => {
    expect(deck).toBeInstanceOf(Deck);
  });
});
