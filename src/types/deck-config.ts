export type PokerSuits = 'S' | 'H' | 'C' | 'D';
export type PokerCards =
  | 'Joker'
  | 'A'
  | 'K'
  | 'Q'
  | 'J'
  | '10'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'
  | '2';

export type PokerPointValueConfig =
  | number
  | { S: number; H: number; C: number; D: number };

export interface IPokerCardPointValues {
  Joker?: PokerPointValueConfig;
  A: PokerPointValueConfig;
  K: PokerPointValueConfig;
  Q: PokerPointValueConfig;
  J: PokerPointValueConfig;
  '10': PokerPointValueConfig;
  '9': PokerPointValueConfig;
  '8': PokerPointValueConfig;
  '7': PokerPointValueConfig;
  '6': PokerPointValueConfig;
  '5': PokerPointValueConfig;
  '4': PokerPointValueConfig;
  '3': PokerPointValueConfig;
  '2': PokerPointValueConfig;
}

export type IDeckType = 'poker' | 'hwatu';

interface IDeckConfigBase {
  count?: number;
}

export interface IPokerDeckConfig extends IDeckConfigBase {
  type: 'poker';
  suitPriority?: 'standard' | Array<PokerSuits>; // defaults to 'standard'
  cardPriority?: 'standard' | Array<PokerCards>; // defaults to 'standard'
  cardPointValues?: number | IPokerCardPointValues; // defaults to 0
  joker?: {
    count: number;
    role: 'wild' | 'point';
  };
}
export interface IHwatuDeckConfig extends IDeckConfigBase {
  type: 'hwatu';
  // todo hwatu deck config
}
export type IDeckConfig = IPokerDeckConfig | IHwatuDeckConfig;
