import { IGameConfig } from '../types/game-config';

export const bids: IGameConfig = {
  playerCount: {
    min: 3,
    max: 6,
  },
  customValues: {
    TrumpSuit: {
      condition: 'first',
      right: {
        unit: ['deck', 'suit'],
      },
    },
    MaxCards: {
      condition: 'floor',
      right: {
        condition: '/',
        left: 52,
        right: {
          unit: ['player', 'count'],
        },
      },
    },
    TrumpBroken: {
      condition: 'contains',
      left: {
        unit: ['all', 'player', 'played', 'cards', 'suit'],
      },
      right: {
        unit: ['customValue', 'TrumpSuit'],
      },
    },
  },
  defaultPlayerContext: {
    Bids: 0,
  },
  rounds: {
    order: {
      '*': {
        nextPlayer: {
          direction: 'clockwise',
        },
        playerPlayConditions: {
          hands: [1],
          guards: {
            condition: 'if',
            left: {
              condition: 'contains',
              left: { unit: ['player', 'hand', 'cards', 'suit'] },
              right: { unit: ['firstPlayer', 'played', 'cards', 'suit'] },
            },
            right: {
              then: {
                condition: '=',
                left: { unit: ['player', 'played', 'cards', 'suit'] },
                right: { unit: ['firstPlayer', 'played', 'cards', 'suit'] },
              },
            },
          },
        },
        completeConditions: {
          condition: '=',
          left: { unit: ['all', 'player', 'played', 'count'] },
          right: {
            condition: '*',
            left: { unit: ['round', 'count'] },
            right: { unit: ['player', 'count'] },
          },
        },
        winConditions: {
          condition: 'greatest of',
          left: { unit: ['player', 'played', 'cards', 'value'] },
          right: { unit: ['all', 'player', 'played', 'cards', 'value'] },
        },
        newDeck: true,
        deal: {
          order: {
            '*': {
              perPerson: {
                condition: 'value if',
                left: {
                  condition: '>',
                  left: { unit: ['customValue', 'MaxCards'] },
                  right: { unit: ['round', 'count'] },
                },
                right: {
                  then: {
                    condition: '+',
                    left: { unit: ['round', 'count'] },
                    right: 1,
                  },
                  else: {
                    condition: 'value if',
                    left: {
                      condition: '=',
                      left: { unit: ['customValue', 'MaxCards'] },
                      right: { unit: ['round', 'count'] },
                    },
                    right: {
                      then: { unit: ['round', 'count'] },
                      else: {
                        condition: '-',
                        left: { unit: ['round', 'count'] },
                        right: { unit: ['customValue', 'MaxCards'] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        subRounds: {
          order: {
            '*': {
              nextPlayer: {
                direction: 'clockwise',
              },
              playerPlayConditions: {
                hands: [1],
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
                  unit: ['all', 'player', 'played', 'count'],
                },
                right: {
                  condition: '*',
                  left: { unit: ['round', 'count'] },
                  right: { unit: ['player', 'count'] },
                },
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
              firstPlayerPlayConditions: {
                hands: [1],
                guards: {
                  condition: 'if',
                  left: {
                    condition: '=',
                    left: {
                      unit: ['customValue', 'TrumpBroken'],
                    },
                    right: false,
                  },
                  right: {
                    then: {
                      condition: 'not contains',
                      left: {
                        unit: ['player', 'played', 'cards', 'suit'],
                      },
                      right: {
                        unit: ['customValue', 'TrumpSuit'],
                      },
                    },
                  },
                },
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
  winConditions: {
    condition: 'greatest of',
    left: { unit: ['player', 'points'] },
    right: { unit: ['all', 'player', 'points'] },
  },
  roundPointCalculation: {
    condition: '+',
    left: { unit: ['wins', 'round', 'count'] },
    right: {
      condition: 'value if',
      left: {
        condition: '=',
        left: { unit: ['wins', 'round', 'count'] },
        right: { unit: ['player', 'context', 'Bids'] },
      },
      right: {
        then: 10,
        else: 0,
      },
    },
  },
  completeConditions: {
    condition: '=',
    left: { unit: ['round', 'count'] },
    right: {
      condition: '-',
      left: {
        condition: '*',
        left: { unit: ['customValue', 'MaxCards'] },
        right: 2,
      },
      right: 1,
    },
  },
  useSubRounds: true,
};
