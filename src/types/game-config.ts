import {
  IBooleanConditional,
  IMathConditional,
  IResolveConditional,
} from './conditional';
import { IDeckConfig } from './deck-config';

/**
 * Support face down cards on table / collection
 * Support claiming colleted count with guards and turn order for claiming
 */

export type IValidHands = '1' | '2' | '3' | '4' | 'poker' | 'any';

export type INextDirection =
  | 'clockwise'
  | 'counter-clockwise'
  | 'left'
  | 'right'
  | 'across'
  | 'none';

export type IPlayTarget = 'table' | 'collection' | 'other-collection';

export interface IRoundPlayCanConditions {
  canCall?: boolean | IBooleanConditional; // default false
  canSkip?: boolean | IBooleanConditional; // default false
  canDraw?: boolean | IBooleanConditional; // default false
  canPlay?: boolean | IBooleanConditional; // default true
  canPass?: boolean | IBooleanConditional; // default false
  canPlace?: boolean | IBooleanConditional; // default false
  canDiscard?: boolean | IBooleanConditional; // default false
  canPlayAfterSkip?: boolean | IBooleanConditional; // default false
}
export interface IRoundPlayConditions extends IRoundPlayCanConditions {
  hands: Array<IValidHands>;
  guards?: IBooleanConditional;
}

export type IPlayerContextValue = string | number | boolean;
export interface IPlayerContext {
  [key: string]: IPlayerContextValue;
}

export interface ISubRoundsConfig {
  firstPlayerConditions?: IBooleanConditional; // default to deal dir next user from dealer
  firstPlayerPlayConditions?: IRoundPlayConditions;
  nextPlayer: {
    direction?: INextDirection;
    guards?: IBooleanConditional;
  };
  playerPlayConditions: IRoundPlayConditions;
  winConditions: IBooleanConditional;
  completeConditions: IBooleanConditional;
  place?: {
    guards?: IBooleanConditional;
  };
  play?: {
    target?: Array<IPlayTarget>;
  };
  collectionVisible?: boolean;
}

/**
 * Intermediary type for ordered entries with fallback (*)
 *
 * even and odd bot yet supported
 */
export type OrderEntryConfig<T = any> = {
  '*'?: T;
  odd?: T; // not used yet
  even?: T; // not used yet
  [key: string]: T | undefined; // should be a number key
};

export interface IRoundsConfig extends ISubRoundsConfig {
  newDeck?: boolean | IBooleanConditional; // default true
  passCards?: {
    order: OrderEntryConfig<INextDirection>;
    loopOrder?: boolean; // defaults true;
    count: number;
  };
  deal?:
    | 'all'
    | {
        order: OrderEntryConfig<{
          perPerson?: IMathConditional | number;
          toTable?: IMathConditional | number;
        }>;
      }; // defaults to 'all'
  discard?: {
    count: number;
  };
  call?: {
    count: number;
    guards?: IBooleanConditional;
    countFromDeck?: number;
  };
  draw?: {
    count: number;
    target?: Array<'deck' | 'discard'>;
  };
  defaultPlayerContext?: IPlayerContext;
  subRounds?: {
    order: OrderEntryConfig<ISubRoundsConfig>;
  };
}

export interface IGameConfig {
  playerCount: {
    min: number;
    max: number;
  };
  deck?: {
    count?: number | IMathConditional; // defaults to 1
  } & IDeckConfig; // default to poker
  nextDealer?: INextDirection;
  // customCardGroups?: { [key: string]: IBooleanConditional };
  customValues?: { [key: string]: IResolveConditional };
  phases: {
    order: Array<'play' | 'discard' | 'draw'>;
    canSkipToLast?: boolean; // default false
  };
  rounds: {
    order: OrderEntryConfig<IRoundsConfig>;
  };
  useSubRounds?: boolean;
  defaultPlayerContext?: IPlayerContext;
  roundPointCalculation?: IMathConditional;
  winConditions: IBooleanConditional;
  completeConditions: IBooleanConditional;
}
