import { get, last } from 'lodash';

import {
  IGameConfig,
  INextDirection,
  IPlayerContext,
  IPlayerContextValue,
  IPlayTarget,
  IRoundPlayCanConditions,
  IRoundPlayConditions,
  OrderEntryConfig,
} from '../types/game-config';
import { resolveCheck, DataValueSymbol } from './checkConditions';
import { validHand } from './checkHand';
import { Card, Deck } from './deck';
import { pokerValue } from './pokerValue';
import { IResolveConditional } from '../types/conditional';

interface INewGameOptions {
  config: IGameConfig;
  playerIds: Array<string>;
}

interface IGameOptions {
  options: IGameState;
}

export interface IGameState {
  config: IGameConfig;
  playerIds: Array<string>;
  points: Array<number>;
  rounds: Array<IGameRound>;
  currentRoundIdx: number;
  complete: boolean;
  winner?: number;
}

interface IGamePlayer {
  hand: Array<string>;
  played: Array<Array<string>>;
  collected: Array<Array<string>>;
  skipped: boolean;
  points: number;
  callCount: number;
  called: Array<Array<string>>;
  context: Record<string, string | number | boolean>;
}

interface IGameRound {
  deck: Deck;
  dealerIdx: number;
  turnIdx: number;
  subRoundIdx: number;
  players: Array<IGamePlayer>;
  table: Array<string>;
  discards: Array<string>;
  firstPlayerIdx: number;
  previousPlayerIdx: number[];
  currentPlayerIdx: number;
  winner?: number;
  called: Array<number>;
  subRounds: Array<IGameRound>;
}

interface IDataProxyArgs {
  path: Array<string>;
  previous: boolean;
  all: boolean;
  winner: boolean;
  player: boolean;
  firstPlayer: boolean;
  deck: boolean;
  table: boolean;
  discards: boolean;
  count: boolean;
  round: boolean;
  customValue: boolean;
  wins: boolean;
}

const clone = <T>(arg: T): T => {
  if (typeof arg === 'undefined') return arg;
  return JSON.parse(JSON.stringify(arg));
};

const recent = (data: Array<any>) => {
  if (Array.isArray(data[0])) {
    return last(data) as Array<any>;
  }
  return data;
};

const getCardValue = (data: any[], entry: string) => {
  if (entry === 'value') {
    if (Array.isArray(data)) {
      return pokerValue(data);
    }
    return data;
  } else if (entry === 'count') {
    return data.length;
  } else if (entry === 'points') {
    return data.map((card: Card) => card.pointValue);
  } else if (entry === 'suit') {
    return data.map((card: Card) => card.suit);
  } else if (entry === 'unit') {
    return data.map((card: Card) => card.unit);
  } else if (entry === 'name') {
    return data.map((card: Card) => card.name);
  }
  return null;
};

const getOrderEntry = <T extends any>(
  order: OrderEntryConfig<T>,
  index: number,
  loop = false,
  allowOdds = false
) => {
  let key = index.toFixed(0);
  if (!!order['*'] && loop) {
    key = (index % Object.keys(order).length).toFixed(0);
  } else if (allowOdds) {
    key = index % 2 === 0 ? 'even' : 'odd';
  }
  return order[key] || order['*'];
};

const defaultProxyArgs: IDataProxyArgs = {
  path: [] as Array<string>,
  previous: false,
  all: false,
  winner: false,
  player: false,
  firstPlayer: false,
  deck: false,
  discards: false,
  table: false,
  round: false,
  count: false,
  customValue: false,
  wins: false,
};

export class Game {
  private config: IGameConfig;
  private playerIdsInternal: Set<string> = new Set<string>();
  private points: Array<number> = [];

  private rounds: Array<IGameRound> = [];
  private currentRoundIdx = -1;
  private complete = false;
  private gameWinner: number | undefined;

  /**
   * The game winner playe id
   *
   * @readonly
   * @memberof Game
   */
  get winner() {
    return typeof this.gameWinner === 'number'
      ? this.playerIds[this.gameWinner]
      : undefined;
  }

  /**
   * The round winner player id
   *
   * @readonly
   * @memberof Game
   */
  get roundWinner() {
    return typeof this.currentRound.winner === 'number'
      ? this.playerIds[this.currentRound.winner]
      : undefined;
  }

  get isActive() {
    return typeof this.currentRound !== 'undefined' && !this.winner;
  }

  get currentPlayerId() {
    return this.playerIds[this.currentRound.currentPlayerIdx];
  }

  get currentPlayerIdx() {
    return this.currentRound.currentPlayerIdx;
  }

  get currentDealerIdx() {
    return this.currentRound.dealerIdx;
  }

  private get playerIds() {
    return [...this.playerIdsInternal.values()];
  }

  private get currentRealRound() {
    return this.rounds[this.currentRoundIdx];
  }

  private get previousRealRound(): IGameRound | undefined {
    return this.rounds[this.currentRoundIdx - 1];
  }

  private get currentRound() {
    const round = this.rounds[this.currentRoundIdx];
    if (this.useSubRounds) return round.subRounds[round.subRoundIdx];
    return this.rounds[this.currentRoundIdx];
  }

  private get previousRound(): IGameRound | undefined {
    const round = this.rounds[this.currentRoundIdx];
    if (this.useSubRounds) return round.subRounds[round.subRoundIdx - 1];
    return this.rounds[this.currentRoundIdx - 1];
  }

  private get currentPlayer() {
    return this.currentRound.players[this.currentRound.currentPlayerIdx];
  }

  private get roundPlayConditions() {
    const roundConfig = this.getRoundConfig();
    return JSON.parse(
      JSON.stringify(
        this.currentRound.turnIdx === 0
          ? roundConfig.firstPlayerPlayConditions
          : roundConfig.playerPlayConditions
      )
    ) as IRoundPlayConditions;
  }

  private get subRoundPlayConditions() {
    const roundConfig = this.getSubRoundConfig();
    return JSON.parse(
      JSON.stringify(
        this.currentRound.turnIdx === 0
          ? roundConfig.firstPlayerPlayConditions
          : roundConfig.playerPlayConditions
      )
    ) as IRoundPlayConditions;
  }

  get currentPlayConditions() {
    if (this.useSubRounds) return this.subRoundPlayConditions;
    return this.roundPlayConditions;
  }

  get currentPlayerData() {
    return JSON.parse(
      JSON.stringify(
        this.currentRound.players[this.currentRound.currentPlayerIdx]
      )
    ) as IGamePlayer;
  }

  get useSubRounds() {
    return !!this.config.useSubRounds;
  }

  get roundComplete() {
    return this.resolveCheckCurrentUser(
      this.getRoundConfig().completeConditions
    );
  }

  get subRoundComplete() {
    if (!this.useSubRounds) return false;
    return this.resolveCheckCurrentUser(
      this.getSubRoundConfig().completeConditions
    );
  }

  get gameComplete() {
    if (this.complete) return true;
    if (this.config.completeConditions)
      return this.resolveCheckCurrentUser(this.config.completeConditions);
    return false;
  }

  private previousPlayerIdx(back = 1): number | null {
    const idx = this.currentRound.previousPlayerIdx.slice(
      0 - back,
      1 - back < 0 ? 1 - back : undefined
    );
    return typeof idx[0] === 'number' ? idx[0] : null;
  }

  get previousPlayedCards(): Array<string> {
    if (!this.currentRound) return [];
    let back = 1;
    let previousIdx = this.previousPlayerIdx(back);
    if (previousIdx === null) return [];
    while (this.currentRound.players[previousIdx].skipped) {
      back += 1;
      previousIdx = this.previousPlayerIdx(back);
      if (previousIdx === null) return [];
    }
    return clone(last(this.currentRound.players[previousIdx].played) || []);
  }

  asJSON() {
    return {
      config: this.config,
      playerIds: this.playerIds,
      points: this.points,
      rounds: this.rounds,
      currentRoundIdx: this.currentRoundIdx,
      complete: this.complete,
      winner: this.gameWinner,
    } as IGameState;
  }

  constructor(options: INewGameOptions | IGameOptions) {
    if ((options as INewGameOptions).config) {
      const { config, playerIds } = options as INewGameOptions;
      this.config = config;
      this.playerIdsInternal = new Set(playerIds);
    } else {
      const config = (options as IGameOptions).options;
      this.config = config.config;
      this.playerIdsInternal = new Set(config.playerIds);
      this.points = config.points;
      this.rounds = config.rounds;
      this.currentRoundIdx = config.currentRoundIdx;
      this.complete = config.complete;
      this.gameWinner = config.winner;
    }
  }

  private getDataProxy = (activePlayerIdx: number) => {
    const args = (overrides: any = {}) => ({
      ...defaultProxyArgs,
      ...overrides,
    });
    return () =>
      new Proxy(
        {},
        {
          get: (_, attribute: string) => {
            if (Object.keys(defaultProxyArgs).includes(attribute))
              return this.createDataProxy(
                args({
                  [attribute]: true,
                }),
                activePlayerIdx
              );
          },
        }
      );
  };

  private parseDataValue = (
    {
      path,
      previous,
      player,
      all,
      winner,
      firstPlayer,
      deck,
      discards,
      table,
      round,
      count,
    }: IDataProxyArgs,
    activePlayerIdx: number
  ) => {
    const getValueFromPlayerCore = (
      player: IGamePlayer | undefined,
      idx: number
    ) => {
      if (typeof player === 'undefined') return undefined;

      const [kind, ...rest] = path;
      let data = player[kind];
      if (typeof kind === 'undefined') return idx;
      for (const entry of rest) {
        if (entry === 'cards') {
          data = recent(data).map(name => {
            if (name instanceof Card) return name;
            return new Card(name, this.config.deck);
          });
        }
        const res = getCardValue(data, entry);
        if (res !== null) return res;
      }
      return data;
    };

    const getValueFromPlayer = (
      player: IGamePlayer | undefined,
      idx: number
    ) => {
      const res = getValueFromPlayerCore(player, idx);
      if (count && Array.isArray(res)) return res.length;
      return res;
    };

    const getValueFromCards = (path: Array<string>, data?: Array<Card>) => {
      if (typeof data === 'undefined') return undefined;
      for (const entry of path) {
        const res = getCardValue(data, entry);
        if (res !== null) return res;
      }
      if (count && Array.isArray(data)) return data.length;
      return data;
    };

    const getValueFrom = (data: any) => {
      if (typeof data === 'undefined') {
        return undefined;
      }
      return get(data, path);
    };

    const getValue = (gameRound: IGameRound) => {
      if (round) return getValueFrom(gameRound);
      if (winner) {
        return getValueFromPlayer(
          clone(
            gameRound.players[
              typeof gameRound.winner === 'number' ? gameRound.winner : '' // '' is to ensure a undefined result
            ]
          ),
          typeof gameRound.winner === 'number' ? gameRound.winner : -1
        );
      }
      if (firstPlayer) {
        return getValueFromPlayer(
          clone(gameRound.players[gameRound.firstPlayerIdx]),
          gameRound.firstPlayerIdx
        );
      }
      if (deck) return getValueFromCards(path, gameRound.deck.cardsLeft);
      if (discards) {
        return getValueFromCards(
          path,
          gameRound.discards.map(v => new Card(v, this.config.deck))
        );
      }
      if (table) {
        return getValueFromCards(
          path,
          gameRound.table.map(v => new Card(v, this.config.deck))
        );
      }
      if (all) {
        return gameRound.players.map((p, idx) =>
          getValueFromPlayer(clone(p), idx)
        );
      }
      return getValueFromPlayer(
        clone(gameRound.players[activePlayerIdx]),
        activePlayerIdx
      );
    };

    if (previous && !player) {
      if (typeof this.previousRound === 'undefined') return undefined;
      return getValue(this.previousRound);
    }
    return getValue(this.currentRound);
  };

  private createDataProxy = (
    baseArgs: IDataProxyArgs,
    activePlayerIdx: number
  ) => {
    const getPlayerIdx = (args: IDataProxyArgs) => {
      if (!args.player) return this.currentRound.currentPlayerIdx;
      if (args.previous && this.currentRound.previousPlayerIdx.length > 0) {
        if (args.path.includes('played')) {
          let back = 1;
          let previousIdx = this.previousPlayerIdx(back);
          if (previousIdx === null) {
            return activePlayerIdx;
          }
          while (this.currentRound.players[previousIdx].skipped) {
            back += 1;
            previousIdx = this.previousPlayerIdx(back);
            if (previousIdx === null) {
              return activePlayerIdx;
            }
          }
          return previousIdx;
        }
        return this.previousPlayerIdx()!;
      }
      return activePlayerIdx;
    };

    const args = clone(baseArgs);

    const prox = new Proxy(
      {},
      {
        get: (_, attribute: string | symbol) => {
          if (attribute === 'previous') {
            args.previous = true;
          } else if (attribute === 'winner') {
            // can only be a winner or a firstPlayer
            args.winner = true;
            args.firstPlayer = false;
          } else if (attribute === 'firstPlayer') {
            // can only be a winner or a firstPlayer
            args.winner = false;
            args.firstPlayer = true;
          } else if (attribute === DataValueSymbol) {
            // get the data value
            if (args.customValue) {
              const customValue = this.config.customValues?.[args.path[0]];
              if (typeof customValue === 'undefined') {
                throw new Error(`Missing custom value ${args.path[0]}`);
              }
              return this.resolveCheck(customValue, activePlayerIdx);
            }
            if (
              args.player &&
              args.previous &&
              this.currentRound.previousPlayerIdx.length === 0
            )
              return undefined;
            if (args.player && args.count && args.path.length === 0)
              return this.playerIds.length;
            if (args.round && args.count) return this.rounds.length;
            if (args.wins && args.count) {
              const idx = getPlayerIdx(args);
              if (args[0] === 'game') {
                return this.rounds.filter(i => i.winner === idx).length;
              } else if (args[0] === 'round') {
                const round = args.previous
                  ? this.previousRealRound
                  : this.currentRealRound;
                return round?.subRounds.filter(i => i.winner === idx).length;
              }
              return 0;
            }
            return this.parseDataValue(args, getPlayerIdx(args));
          } else if (attribute === 'player') {
            args.player = true;
          } else if (attribute === 'deck') {
            args.deck = true;
          } else if (attribute === 'discards') {
            args.discards = true;
          } else if (attribute === 'table') {
            args.table = true;
          } else if (attribute === 'round') {
            args.round = true;
          } else if (attribute === 'count') {
            args.count = true;
          } else if (attribute === 'wins') {
            args.wins = true;
          } else if (attribute === 'customValue') {
            args.customValue = true;
          } else if (typeof attribute === 'string') {
            args.path.push(attribute);
          }
          return prox;
        },
      }
    );
    return prox;
  };

  private resolveCheck = (
    conditional: IResolveConditional,
    idx: number,
    other?: any
  ) => resolveCheck(conditional, this.getDataProxy(idx), other);

  public resolveCheckCurrentUser = (
    conditional: IResolveConditional,
    other?: any
  ) =>
    this.resolveCheck(conditional, this.currentRound.currentPlayerIdx, other);

  private evaluateUserIdx = (conditional: IResolveConditional, other?: any) => {
    for (let idx = 0; idx < this.playerIds.length; idx += 1) {
      if (this.resolveCheck(conditional, idx, other)) return idx;
    }
    return;
  };

  private getRoundConfig = (entry?: number) => {
    const len = typeof entry === 'number' ? entry : this.rounds.length - 1;
    const roundConfig = getOrderEntry(this.config.rounds.order, len);
    if (!roundConfig)
      throw new Error(
        `Missing round config for turn "${len}". Add a default order of * or the specific turn index.`
      );
    return roundConfig;
  };

  private getSubRoundConfig = (entry?: number, roundEntry?: number) => {
    if (!this.useSubRounds)
      throw new Error("Can't use sub-rounds without useSubRounds true");
    const roundConfig = this.getRoundConfig(roundEntry);
    const len =
      typeof entry === 'number'
        ? entry
        : this.currentRound.subRounds.length - 1;
    if (!roundConfig.subRounds)
      throw new Error('Missing sub-round config for round');
    const subRoundConfig = getOrderEntry(roundConfig.subRounds.order, len);
    if (!subRoundConfig)
      throw new Error(
        `Missing sub-round config for turn ${len}. Add a default order of * or the specific turn index.`
      );
    return roundConfig;
  };

  private getNextPlayer = (playerIdx: number, direction: INextDirection) => {
    const playerCount = this.currentRound.players.length;
    if (direction === 'left' || direction === 'clockwise') {
      if (playerIdx === 0) {
        return playerCount - 1;
      }
      return playerIdx - 1;
    } else if (direction === 'right' || direction === 'counter-clockwise') {
      if (playerIdx === playerCount - 1) {
        return 0;
      }
      return playerIdx + 1;
    } else if (direction === 'across') {
      const nextIdxDiff = Math.floor(playerCount / 2);
      return playerIdx + nextIdxDiff - playerCount;
    }
    return playerIdx;
  };

  private removeCardsFromHand = (
    cards: Array<string>,
    playerIdxOverride?: number
  ) => {
    const playerIdx = playerIdxOverride || this.currentPlayerIdx;
    this.currentRound.players[playerIdx].hand = this.currentRound.players[
      playerIdx
    ].hand.filter(i => !cards.includes(i));
  };

  private addCardsToHand = (
    cards: Array<string>,
    playerIdxOverride?: number
  ) => {
    const playerIdx = playerIdxOverride || this.currentPlayerIdx;
    this.currentRound.players[playerIdx].hand = [
      ...this.currentRound.players[playerIdx].hand,
      ...cards,
    ];
  };

  private setContextFlags = (
    context: IPlayerContext,
    playerIdxOverride?: number
  ) => {
    const playerIdx = playerIdxOverride || this.currentPlayerIdx;
    this.currentRound.players[playerIdx].context = context;
  };

  private setContextFlag = (
    flag: string,
    value: IPlayerContextValue,
    playerIdxOverride?: number
  ) => {
    const playerIdx = playerIdxOverride || this.currentPlayerIdx;
    this.currentRound.players[playerIdx].context = {
      ...this.currentRound.players[playerIdx].context,
      [flag]: value,
    };
  };

  private newRound = () => {
    this.currentRoundIdx += 1;
    const roundConfig = this.getRoundConfig(this.currentRoundIdx);
    const newDealerIdx =
      this.currentRoundIdx !== 0 && !!this.config.nextDealer
        ? this.getNextPlayer(this.currentPlayerIdx, this.config.nextDealer)
        : 0;
    const newContext =
      roundConfig.defaultPlayerContext ||
      this.config.defaultPlayerContext ||
      {};

    if (roundConfig.newDeck || this.currentRoundIdx === 0) {
      const deck = new Deck(this.config.deck);
      deck.createAndShuffle(this.resolveCheck(this.config.deck?.count || 1, 0));

      this.rounds.push({
        deck,
        turnIdx: 0,
        dealerIdx: newDealerIdx,
        table: [],
        discards: [],
        players: new Array(this.playerIdsInternal.size).fill('').map(() =>
          roundConfig.subRounds
            ? ({ points: 0 } as any)
            : {
                hand: [],
                played: [],
                collected: [],
                skipped: false,
                points: 0,
                callCount: 0,
                called: [],
                context: newContext,
              }
        ),
        firstPlayerIdx: 0,
        previousPlayerIdx: [],
        currentPlayerIdx: 0,
        called: [],
        subRoundIdx: -1,
        subRounds: [],
      });

      const { players, table } = this.deal();
      this.rounds[this.currentRoundIdx].table = table;
      for (let i = 0; i < players.length; i += 1) {
        this.rounds[this.currentRoundIdx].players[i].hand = players[i];
      }
    } else {
      this.rounds.push({
        ...clone(this.previousRealRound!),
        dealerIdx: newDealerIdx,
        players: this.previousRealRound!.players.map(prePlayer =>
          roundConfig.subRounds
            ? ({ points: 0 } as any)
            : {
                hand: clone(prePlayer.hand),
                played: [],
                collected: [],
                skipped: false,
                points: 0,
                callCount: 0,
                called: [],
                context: newContext,
              }
        ),
        turnIdx: 0,
        table: [],
        discards: [],
        firstPlayerIdx: 0,
        previousPlayerIdx: [],
        currentPlayerIdx: 0,
        called: [],
        winner: undefined,
        subRounds: [],
      });
    }

    const foundIdx = roundConfig.firstPlayerConditions
      ? this.evaluateUserIdx(roundConfig.firstPlayerConditions)
      : this.getNextPlayer(
          newDealerIdx,
          roundConfig.nextPlayer.direction || 'clockwise'
        );

    if (typeof foundIdx === 'number') {
      this.currentRound.firstPlayerIdx = foundIdx;
      this.currentRound.currentPlayerIdx = foundIdx;
    } else if (!this.useSubRounds) {
      throw new Error(
        'Failed to find a player that matches the first player conditions'
      );
    }
  };

  private newSubRound = () => {
    if (this.useSubRounds) {
      this.currentRound.subRoundIdx += 1;
      const roundConfig = this.getSubRoundConfig(this.currentRound.subRoundIdx);

      const newContext =
        roundConfig.defaultPlayerContext ||
        this.config.defaultPlayerContext ||
        {};

      if (this.currentRound.subRoundIdx === 0) {
        this.currentRound.subRounds.push({
          deck: this.currentRound.deck,
          turnIdx: 0,
          dealerIdx: 0,
          table: [],
          discards: [],
          players: new Array(this.playerIdsInternal.size).fill('').map(() => ({
            hand: [],
            played: [],
            collected: [],
            skipped: false,
            points: 0,
            callCount: 0,
            called: [],
            context: newContext,
          })),
          firstPlayerIdx: 0,
          previousPlayerIdx: [],
          currentPlayerIdx: 0,
          called: [],
          subRoundIdx: -1,
          subRounds: [],
        });

        const { players, table } = this.deal();
        this.currentRound.table = table;
        for (let i = 0; i < players.length; i += 1) {
          this.currentRound.players[i].hand = players[i];
        }
      } else {
        this.rounds.push({
          ...clone(this.previousRound!),
          deck: this.currentRound.deck,
          players: this.previousRound!.players.map(prePlayer => ({
            hand: clone(prePlayer.hand),
            played: [],
            collected: [],
            skipped: false,
            points: 0,
            callCount: 0,
            called: [],
            context: newContext,
          })),
          turnIdx: 0,
          table: [],
          discards: [],
          firstPlayerIdx: 0,
          previousPlayerIdx: [],
          currentPlayerIdx: 0,
          called: [],
          winner: undefined,
        });
      }

      const foundIdx = roundConfig.firstPlayerConditions
        ? this.evaluateUserIdx(roundConfig.firstPlayerConditions)
        : this.getNextPlayer(
            this.currentDealerIdx,
            roundConfig.nextPlayer.direction || 'clockwise'
          );
      if (typeof foundIdx === 'number') {
        this.currentRound.firstPlayerIdx = foundIdx;
        this.currentRound.currentPlayerIdx = foundIdx;
      }
    }
  };

  private evaluateWinner = () =>
    this.evaluateUserIdx(this.config.winConditions);

  private evaluateRoundWinner = () =>
    this.evaluateUserIdx(this.getRoundConfig().winConditions);

  private evaluateSubRoundWinner = () =>
    this.evaluateUserIdx(this.getSubRoundConfig().winConditions);

  private calculateRoundPoints = () => {
    if (this.config.roundPointCalculation) {
      for (let i = 0; i < this.currentRound.players.length; i++) {
        const res = this.resolveCheck(this.config.roundPointCalculation, i);
        this.currentRound.players[i].points = res;
        if (this.useSubRounds) {
          this.rounds[this.currentRoundIdx].players[i].points = res;
        }
      }
    }
  };

  private calculateGamePoints = () => {
    this.points = this.rounds.reduce((res, round) => {
      return round.players.reduce((points, player, idx) => {
        points[idx] += player.points;
        return points;
      }, res);
    }, new Array(this.playerIdsInternal.size).fill(0));
  };

  get roundWon() {
    return (
      typeof this.currentRound !== 'undefined' &&
      typeof this.currentRound.winner !== 'undefined'
    );
  }

  get canAddPlayer() {
    return (
      this.rounds.length === 0 &&
      (this.playerIdsInternal.size < this.config.playerCount.min ||
        this.playerIdsInternal.size < this.config.playerCount.max)
    );
  }

  addPlayer = (playerId: string) => {
    if (!this.canAddPlayer) throw new Error('Can no longer add players');
    this.playerIdsInternal.add(playerId);
  };

  get canStart() {
    return (
      !this.complete &&
      (this.roundWon ||
        (this.playerIdsInternal.size >= this.config.playerCount.min &&
          this.playerIdsInternal.size <= this.config.playerCount.max))
    );
  }

  start = () => {
    if (!this.canStart) {
      throw new Error('Not able to start the game');
    }
    if (this.rounds.length === 0) {
      this.points = new Array(this.playerIdsInternal.size).fill(0);
    }
    this.newRound();
    this.newSubRound();
    if (this.getRoundConfig().passCards) {
      return 'passCards';
    }
    return 'start';
  };

  private canDo(
    playConditionKey: keyof IRoundPlayCanConditions,
    defaultMissing = false
  ) {
    if (this.roundWon) return false;
    const condition = this.currentPlayConditions[playConditionKey];
    if (typeof condition === 'boolean') return condition;
    if (typeof condition === 'undefined') return defaultMissing;
    return this.resolveCheckCurrentUser(condition);
  }

  get passDirection() {
    const roundConfig = this.getRoundConfig();
    if (roundConfig.passCards) {
      const loop = roundConfig.passCards.loopOrder;
      const dir = getOrderEntry(
        roundConfig.passCards.order,
        this.currentRound.turnIdx,
        typeof loop === 'boolean' ? loop : true,
        false
      );
      return dir || 'none';
    }
    return 'none';
  }

  get canPass() {
    const can = this.canDo('canPass');
    if (!can) return false;
    return this.passDirection !== 'none';
  }

  pass = (playerIdx: number, cards: Array<string>) => {
    const passDir = this.passDirection;
    if (passDir === 'none') throw new Error('Not able to pass cards');
    const nextPlayerIdx = this.getNextPlayer(playerIdx, passDir);
    this.removeCardsFromHand(cards, playerIdx);
    this.addCardsToHand(cards, nextPlayerIdx);
  };

  deal = () => {
    const roundConfig = this.getRoundConfig();
    if (!roundConfig || !roundConfig.deal || roundConfig.deal === 'all') {
      return this.currentRound.deck.deal(
        { perPerson: 'even', toTable: 0 },
        this.playerIdsInternal.size
      );
    }

    const len = this.currentRound.turnIdx;
    const dealConfig = getOrderEntry(roundConfig.deal.order, len);
    if (!dealConfig)
      throw new Error(
        `Missing deal config for turn "${len}". Add a default order of * or the specific turn index.`
      );

    const config = {};
    for (const key of Object.keys(dealConfig)) {
      config[key] =
        typeof dealConfig[key] === 'number'
          ? dealConfig[key]
          : this.resolveCheckCurrentUser(dealConfig[key]);
    }

    return this.currentRound.deck.deal(config, this.playerIdsInternal.size);
  };

  get canDraw() {
    return this.canDo('canDraw');
  }

  get drawTargets() {
    if (!this.canDraw) throw new Error('Drawing cards is not supported');
    const roundConfig = this.getRoundConfig();
    return roundConfig.draw!.target || ['deck'];
  }

  draw = (fromDiscard: boolean) => {
    if (!this.canDraw) throw new Error('Drawing cards is not supported');
    const roundConfig = this.getRoundConfig();
    const drawCount = roundConfig.draw!.count;
    let cards: Array<string> = [];
    // draw from discard if its a choice or if its forced
    if (
      (fromDiscard && this.drawTargets.includes('discard')) ||
      (this.drawTargets.length === 1 && this.drawTargets[0] === 'discard')
    ) {
      cards = this.currentRound.table.slice(0 - drawCount);
      this.currentRound.table = this.currentRound.table.slice(
        0,
        this.currentRound.table.length - drawCount
      );
    } else {
      // draw from the deck
      cards = this.currentRound.deck.deal(
        {
          perPerson: drawCount,
        },
        1
      ).players[0];
      this.currentRound.table = this.currentRound.table.slice(drawCount);
      // if the discard was called award it
      if (this.canCall && this.currentRound.called.length > 0) {
        // get the first called player that can call
        const calledPlayerIdx = this.currentRound.called.find(idx => {
          if (!roundConfig.call?.guards) return true;
          return this.resolveCheck(roundConfig.call?.guards, idx);
        });
        const callCount = roundConfig.call!.count;

        // give discard to player that called
        if (typeof calledPlayerIdx === 'number') {
          let calledCards = this.currentRound.table.slice(0 - callCount);
          this.currentRound.table = this.currentRound.table.slice(
            0,
            this.currentRound.table.length - callCount
          );
          // penalty cards from the deck
          if (typeof roundConfig.call!.countFromDeck === 'number') {
            const extraCards = this.currentRound.deck.deal(
              {
                perPerson: roundConfig.call!.countFromDeck,
              },
              1
            ).players[0];
            calledCards = [...calledCards, ...extraCards];
          }
          this.addCardsToHand(calledCards, calledPlayerIdx);
        }
      }
    }
    this.currentRound.called = [];
    this.addCardsToHand(cards);
  };

  get canSkip() {
    return this.canDo('canSkip');
  }

  skip = () => {
    if (!this.canSkip) throw new Error('Skipping is not allowed');
    this.currentPlayer.skipped = true;
  };

  get canPlay() {
    return this.canDo('canPlay', true);
  }

  checkAllowedPlay = (
    cards: Array<string>,
    target: IPlayTarget,
    otherPlayerIdx?: number
  ) => {
    if (!this.canPlay) return false;
    const { hands, guards } = this.currentPlayConditions;
    if (validHand(cards, hands, this.config.deck)) {
      const oldHand = [...this.currentPlayer.hand];
      const oldTable = [...this.currentRound.table];
      if (target === 'table') {
        this.currentRound.table = [...this.currentRound.table, ...cards];
      } else if (target === 'collection') {
        this.currentPlayer.collected.push(cards);
      } else if (target === 'other-collection' && otherPlayerIdx) {
        this.currentRound.players[otherPlayerIdx].collected.push(cards);
      }
      this.currentPlayer.played.push(cards);
      this.removeCardsFromHand(cards);

      const resetCards = () => {
        if (target === 'table') {
          this.currentRound.table = oldTable;
        } else if (target === 'collection') {
          this.currentPlayer.collected.pop();
        } else if (target === 'other-collection' && otherPlayerIdx) {
          this.currentRound.players[otherPlayerIdx].collected.pop();
        }
        this.currentPlayer.hand = oldHand;
        this.currentPlayer.played.pop();
      };

      if (
        !guards ||
        this.resolveCheck(
          guards,
          target === 'other-collection'
            ? otherPlayerIdx!
            : this.currentRound.currentPlayerIdx
        )
      ) {
        resetCards();
        return true;
      }
      resetCards();
    }
    return false;
  };

  play = (
    cards: Array<string>,
    target: IPlayTarget = 'table',
    otherPlayerIdx?: number
  ) => {
    if (!this.checkAllowedPlay(cards, target, otherPlayerIdx)) {
      throw new Error('This type of hand is not allowed');
    }
    if (target === 'table') {
      this.currentRound.table = [...this.currentRound.table, ...cards];
    } else if (target === 'collection') {
      this.currentPlayer.collected.push(cards);
    } else if (target === 'other-collection' && otherPlayerIdx) {
      this.currentRound.players[otherPlayerIdx].collected.push(cards);
    }
    this.currentPlayer.played.push(cards);
    this.removeCardsFromHand(cards);
  };

  get canCall() {
    return this.canDo('canCall');
  }

  call = (playerIdx: number) => {
    if (!this.canCall) throw new Error('Calling is not allowed');
    const roundConfig = this.getRoundConfig();
    if (roundConfig.call?.guards) {
      if (!this.resolveCheck(roundConfig.call?.guards, playerIdx)) {
        throw new Error('User is not allowed to call');
      }
    }

    this.currentRound.called.push(playerIdx);
  };

  get canDiscard() {
    return this.canDo('canDiscard');
  }

  discard = (cards: Array<string>) => {
    if (!this.canDiscard) throw new Error('Discarding not allowed');

    const roundConfig = this.getRoundConfig();
    if (roundConfig.discard!.count !== cards.length) {
      throw new Error(
        `Card count does not match the required amount of ${
          roundConfig.discard!.count
        }`
      );
    }
    this.currentRound.table = [...(this.currentRound.table || []), ...cards];
    this.removeCardsFromHand(cards);
  };

  get canPlace() {
    return this.canDo('canPlace');
  }

  place = (cards: Array<string>) => {
    if (!this.canPlace) throw new Error('Placing not allowed');

    const roundConfig = this.getRoundConfig();
    if (
      roundConfig.place!.guards &&
      !this.resolveCheckCurrentUser(roundConfig.place!.guards)
    ) {
      throw new Error('The cards placed did not meet the required conditions');
    }
    this.currentPlayer.collected.push(cards);
    this.removeCardsFromHand(cards);
  };

  done = () => {
    const roundConfig = this.getRoundConfig();
    const { direction, guards } = roundConfig.nextPlayer || {
      direction: 'clockwise',
    };
    let nextPlayerIdx = this.getNextPlayer(
      this.currentRound.currentPlayerIdx,
      direction!
    );
    if (guards) {
      while (!this.resolveCheck(guards, nextPlayerIdx)) {
        nextPlayerIdx = this.getNextPlayer(nextPlayerIdx, direction!);
      }
    }
    if (!this.roundComplete && !this.subRoundComplete) {
      if (
        !this.currentPlayer.skipped &&
        this.currentPlayConditions.canPlayAfterSkip
      ) {
        // set all skipped to false if canPlayAfterSkip is true to allow for a second chance
        for (let i = 0; i < this.currentRound.players.length; i += 1) {
          this.currentRound.players[i].skipped = false;
        }
      }
      this.currentRound.turnIdx += 1;
      this.currentRound.previousPlayerIdx.push(
        this.currentRound.currentPlayerIdx
      );
      this.currentRound.currentPlayerIdx = nextPlayerIdx;
      this.currentPlayer.skipped = false;
    } else {
      if (this.roundComplete) {
        this.calculateRoundPoints();
        this.currentRound.winner = this.evaluateRoundWinner();
        if (this.gameComplete) {
          this.calculateGamePoints();
          this.complete = true;
          this.gameWinner = this.evaluateWinner();
        } else {
          this.newRound();
        }
      } else if (this.subRoundComplete) {
        this.currentRound.winner = this.evaluateSubRoundWinner();
        this.newSubRound();
      }
    }
  };

  setPlayerContextFlag = (
    flag: string,
    value: IPlayerContextValue,
    playerIdx?: number
  ) => {
    this.setContextFlag(flag, value, playerIdx);
  };

  setPlayerContextFlags = (context: IPlayerContext, playerIdx?: number) => {
    this.setContextFlags(context, playerIdx);
  };
}
