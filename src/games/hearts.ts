import { IGameConfig, IRoundsConfig } from '../types/game-config';

const baseRoundConfig: Pick<
  IRoundsConfig,
  | 'nextPlayer'
  | 'playerPlayConditions'
  | 'winConditions'
  | 'completeConditions'
  | 'deal'
> = {
  nextPlayer: {
    direction: 'clockwise',
  },
  playerPlayConditions: {
    hands: ['1'],
    guards: {
      condition: 'if',
      left: {
        condition: 'contains',
        left: {
          unit: ['player', 'hand', 'cards', 'suit'],
        },
        right: {
          unit: ['firstPlayer', 'played', 'cards', 'suit'],
        },
      },
      right: {
        then: {
          condition: '=',
          left: {
            unit: ['player', 'played', 'cards', 'suit'],
          },
          right: {
            unit: ['firstPlayer', 'played', 'cards', 'suit'],
          },
        },
      },
    },
  },
  completeConditions: {
    condition: '=',
    left: {
      unit: ['player', 'played', 'count'],
    },
    right: 4,
  },
  winConditions: {
    condition: 'greatest of',
    left: {
      unit: ['player', 'played', 'cards', 'value'],
    },
    right: {
      unit: ['all', 'player', 'played', 'cards', 'value'],
    },
  },
  deal: 'all',
};

export const hearts: IGameConfig = {
  playerCount: {
    min: 4,
    max: 4,
  },
  deck: {
    count: 1,
    type: 'poker',
    suitPriority: ['H', 'S', 'D', 'C'],
    cardPointValues: {
      A: { H: 1, C: 0, S: 0, D: 0 },
      K: { H: 1, C: 0, S: 0, D: 0 },
      Q: { H: 1, C: 0, S: 13, D: 0 },
      J: { H: 1, C: 0, S: 0, D: 0 },
      '10': { H: 1, C: 0, S: 0, D: 0 },
      '9': { H: 1, C: 0, S: 0, D: 0 },
      '8': { H: 1, C: 0, S: 0, D: 0 },
      '7': { H: 1, C: 0, S: 0, D: 0 },
      '6': { H: 1, C: 0, S: 0, D: 0 },
      '5': { H: 1, C: 0, S: 0, D: 0 },
      '4': { H: 1, C: 0, S: 0, D: 0 },
      '3': { H: 1, C: 0, S: 0, D: 0 },
      '2': { H: 1, C: 0, S: 0, D: 0 },
    },
  },
  customValues: {
    HeartsBroken: {
      condition: 'contains',
      left: {
        unit: ['all', 'player', 'played', 'cards', 'suit'],
      },
      right: 'H',
    },
  },
  rounds: {
    order: {
      '0': {
        ...baseRoundConfig,
        newDeck: true,
        firstPlayerConditions: {
          condition: 'contains',
          left: {
            unit: ['player', 'hand', 'cards', 'name'],
          },
          right: '2C',
        },
        firstPlayerPlayConditions: {
          hands: ['1'],
          guards: {
            condition: 'contains',
            left: {
              unit: ['player', 'played', 'cards', 'name'],
            },
            right: '2C',
          },
        },
      },
      '*': {
        ...baseRoundConfig,
        newDeck: false,
        firstPlayerConditions: {
          condition: '=',
          left: {
            unit: ['previous', 'winner'],
          },
          right: {
            unit: ['player'],
          },
        },
        firstPlayerPlayConditions: {
          hands: ['1'],
          guards: {
            condition: 'if',
            left: {
              condition: '=',
              left: {
                unit: ['customValue', 'HeartsBroken'],
              },
              right: false,
            },
            right: {
              then: {
                condition: 'not contains',
                left: {
                  unit: ['player', 'played', 'cards', 'suit'],
                },
                right: 'H',
              },
            },
          },
        },
        passCards: {
          order: {
            '1': 'left',
            '2': 'right',
            '3': 'across',
            '4': 'none',
          },
          loopOrder: true,
          count: 3,
        },
      },
    },
  },
  phases: {
    order: ['play'],
  },
  winConditions: {
    condition: 'least of',
    left: {
      unit: ['player', 'points'],
    },
    right: {
      unit: ['all', 'player', 'points'],
    },
  },
  roundPointCalculation: {
    condition: 'sum',
    right: {
      unit: ['player', 'collected', 'cards', 'points'],
    },
  },
  completeConditions: {
    condition: 'any >=',
    left: {
      unit: ['all', 'player', 'points'],
    },
    right: 100,
  },
};
