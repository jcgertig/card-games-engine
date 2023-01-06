import {
  IDeckConfig,
  IPokerCardPointValues,
  PokerCards,
  PokerPointValueConfig,
  PokerSuits,
} from '../types/deck-config';

const POKER_SUITS = ['S', 'H', 'C', 'D'];
const POKER_UNITS = [
  'A',
  'K',
  'Q',
  'J',
  '10',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];
const POKER_CARDS = POKER_SUITS.reduce<Array<string>>((res, suit) => {
  return [...res, ...POKER_UNITS.map(unit => `${unit}${suit}`)];
}, []);

function shuffle<T = any>(array: Array<T>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pokerPriority(cardPriority?: 'standard' | Array<PokerCards>) {
  if (!cardPriority || cardPriority === 'standard') return [...POKER_UNITS];
  return cardPriority;
}

function pokerSuitPriority(suitPriority?: 'standard' | Array<PokerSuits>) {
  if (!suitPriority || suitPriority === 'standard') return [...POKER_SUITS];
  return suitPriority;
}

function pokerPointValue(
  values: number | IPokerCardPointValues | undefined,
  unit: string
): PokerPointValueConfig {
  if (typeof values === 'number') return values;
  if (typeof values === 'undefined') return 0;
  return values[unit as keyof IPokerCardPointValues] || 0;
}

export class Card {
  private deckConfig: IDeckConfig;
  name: string;
  suit = '';
  unit = '';
  pointValue = 0;
  unitPriority = 0;

  get value() {
    if (this.deckConfig.type === 'poker') {
      const cardPriority = pokerPriority(this.deckConfig.cardPriority);
      const suitPriority = pokerSuitPriority(this.deckConfig.suitPriority);
      return (
        (cardPriority.length - this.unitPriority - 1) * 10 +
        (this.suit ? suitPriority.length - this.suitPriority - 1 : 0)
      );
    }
    return 0;
  }

  get pokerPriority() {
    if (this.deckConfig.type === 'poker') {
      return POKER_UNITS.indexOf(this.unit);
    }
    return 0;
  }

  get suitPriority() {
    if (this.deckConfig.type === 'poker') {
      return pokerSuitPriority(this.deckConfig.suitPriority).indexOf(
        this.suit as PokerSuits
      );
    }
    return 0;
  }

  constructor(
    name: string,
    deckConfig: IDeckConfig = { count: 1, type: 'poker' }
  ) {
    this.deckConfig = deckConfig;
    this.name = name;
    if (this.deckConfig.type === 'poker') {
      for (const suit of POKER_SUITS) {
        if (suit === name.slice(0 - suit.length)) {
          this.suit = suit;
          this.unit = name.slice(0, name.length - suit.length);
          const map = pokerPointValue(
            this.deckConfig.cardPointValues,
            this.unit
          );
          const cardPriority = pokerPriority(this.deckConfig.cardPriority);
          this.pointValue = typeof map === 'number' ? map : map[this.suit];
          this.unitPriority = cardPriority.indexOf(this.unit as PokerCards);
        }
      }
    }
  }
}

function cardsForDeck(config: IDeckConfig) {
  let cards: Array<string> = [];
  if (config.type === 'poker') {
    cards = [...POKER_CARDS];
    if (config.joker) {
      cards = [...cards, ...new Array(config.joker.count || 0).fill('Joker')];
    }
  } else if (config.type === 'hwatu') {
    // todo handle hwatu decks
  }
  return cards;
}

export class Deck {
  private cards: Array<string> = [];
  private left: Array<string> = [];

  private config: IDeckConfig;

  constructor(config: IDeckConfig = { count: 1, type: 'poker' }) {
    this.config = config;
    this.cards = cardsForDeck(config);
    if (typeof config.count === 'number' && config.count > 1) {
      let addCount = config.count - 1;
      while (addCount > 0) {
        addCount -= 1;
        this.cards = [...this.cards, ...cardsForDeck(config)];
      }
    }
  }

  get cardsLeft() {
    return this.left.map(v => new Card(v, this.config));
  }

  createAndShuffle = (count: number) => {
    let cards = [...this.cards];
    for (let i = 1; i < count; i += 1) {
      cards = [...cards, ...this.cards];
    }
    this.left = shuffle(cards);
  };

  deal = (
    config: { perPerson?: 'even' | number; toTable?: number },
    personCount: number
  ) => {
    const { perPerson = 0, toTable = 0 } = config;
    let players: Array<Array<string>> = new Array(personCount).fill([]);
    const table = this.left.slice(0, toTable);
    this.left = this.left.slice(toTable);
    const count =
      perPerson === 'even'
        ? Math.floor(this.left.length / personCount)
        : perPerson;
    players = players.map(() => {
      const player = this.left.slice(0, count);
      this.left = this.left.slice(count);
      return player;
    });
    return { players, table };
  };
}
