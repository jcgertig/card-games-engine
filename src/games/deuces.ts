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
    hands: [1, 2, 3, 'poker'],
    guards: {
      condition: 'and',
      right: [
        {
          condition: '=',
          left: {
            unit: ['player', 'played', 'cards', 'count'],
          },
          right: {
            unit: ['previous', 'player', 'played', 'cards', 'count'],
          },
        },
        {
          condition: '>',
          left: {
            unit: ['player', 'played', 'cards', 'value'],
          },
          right: {
            unit: ['previous', 'player', 'played', 'cards', 'value'],
          },
        },
        {
          condition: 'if',
          left: {
            condition: '=',
            left: {
              unit: ['player', 'hand', 'cards', 'count'],
            },
            right: 0,
          },
          right: {
            then: {
              condition: 'not contains',
              left: {
                unit: ['player', 'played', 'cards', 'unit'],
              },
              right: '2',
            },
          },
        },
      ],
    },
    canSkip: true,
    canPlayAfterSkip: true,
  },
  winConditions: {
    condition: 'or',
    right: [
      {
        condition: '=',
        left: {
          unit: ['player', 'hand', 'cards', 'count'],
        },
        right: 0,
      },
      {
        condition: 'if',
        left: {
          condition: '!=',
          left: {
            unit: ['all', 'player', 'hand', 'cards', 'count'],
          },
          right: 0,
        },
        right: {
          then: {
            condition: '=',
            left: {
              unit: ['player', 'skipped'],
            },
            right: false,
          },
          else: false,
        },
      },
    ],
  },
  completeConditions: {
    condition: 'or',
    right: [
      {
        condition: '=',
        left: {
          unit: ['all', 'player', 'hand', 'cards', 'count'],
        },
        right: 0,
      },
      {
        condition: '=',
        left: {
          condition: 'count',
          right: {
            condition: 'filter',
            left: {
              unit: ['all', 'player', 'skipped'],
            },
            right: {
              condition: '=',
              left: { unit: [] },
              right: true,
            },
          },
        },
        right: 3,
      },
    ],
  },
  deal: 'all',
};

export const deuces: IGameConfig = {
  playerCount: {
    min: 4,
    max: 4,
  },
  deck: {
    count: 1,
    type: 'poker',
    suitPriority: ['S', 'H', 'C', 'D'],
    cardPriority: [
      '2',
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
    ],
    cardPointValues: {
      A: 0,
      K: 0,
      Q: 0,
      J: 0,
      '10': 0,
      '9': 0,
      '8': 0,
      '7': 0,
      '6': 0,
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
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
          right: '3D',
        },
        firstPlayerPlayConditions: {
          hands: [1, 2, 3, 'poker'],
          guards: {
            condition: 'contains',
            left: {
              unit: ['player', 'played', 'cards', 'name'],
            },
            right: '3D',
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
          hands: [1, 2, 3, 'poker'],
          guards: {
            condition: 'if',
            left: {
              condition: '=',
              left: {
                unit: ['player', 'hand', 'cards', 'count'],
              },
              right: 0,
            },
            right: {
              then: {
                condition: 'not contains',
                left: {
                  unit: ['player', 'played', 'cards', 'unit'],
                },
                right: '2',
              },
            },
          },
        },
      },
    },
  },
  phases: {
    order: ['play'],
  },
  completeConditions: {
    condition: 'contains',
    left: {
      unit: ['all', 'player', 'hand', 'cards', 'count'],
    },
    right: 0,
  },
  winConditions: {
    condition: '=',
    left: {
      unit: ['player', 'hand', 'cards', 'count'],
    },
    right: 0,
  },
};
