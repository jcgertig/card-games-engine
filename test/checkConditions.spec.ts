import { resolveCheck, DataValueSymbol } from '../src/logic/checkConditions';

describe('resolveCheck', () => {
  test('should throw an error for a unknown conditional', () => {
    try {
      resolveCheck({ condition: 'fail' } as any, {} as any);
      expect(true).toEqual(false);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((e as any).message).toEqual('unknown condition fail');
    }
  });

  describe('Direct values', () => {
    it('returns direct number', () => {
      expect(resolveCheck(1, {} as any)).toEqual(1);
    });

    it('returns direct string', () => {
      expect(resolveCheck('a', {} as any)).toEqual('a');
    });

    it('returns direct boolean', () => {
      expect(resolveCheck(false, {} as any)).toEqual(false);
    });

    it('returns direct array', () => {
      const x = [1, 2, 3];
      expect(resolveCheck(x as any, {} as any)).toEqual(x);
    });

    it('returns value for unit x', () => {
      expect(
        resolveCheck({ unit: ['x'] }, { x: { [DataValueSymbol]: 1 } })
      ).toEqual(1);
    });

    it('returns value for unit x y z', () => {
      expect(
        resolveCheck(
          { unit: ['x', 'y', 'z'] },
          {
            x: {
              [DataValueSymbol]: 1,
              y: { [DataValueSymbol]: 2, z: { [DataValueSymbol]: 3 } },
            },
          }
        )
      ).toEqual(3);
    });

    it('returns undefined for unit not found', () => {
      expect(
        resolveCheck({ unit: ['x'] }, { y: { [DataValueSymbol]: 1 } })
      ).toEqual(undefined);
    });
  });

  describe('MathConditionals', () => {
    it('returns a number for a + MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: '+',
            right: 8,
            left: {
              unit: ['value'],
            },
          },
          { value: { [DataValueSymbol]: 5 } }
        )
      ).toEqual(13);
    });

    it('returns a number for a - MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: '-',
            right: 8,
            left: {
              unit: ['value'],
            },
          },
          { value: { [DataValueSymbol]: 5 } }
        )
      ).toEqual(-3);
    });

    it('returns a number for a * MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: '*',
            right: 8,
            left: {
              unit: ['value'],
            },
          },
          { value: { [DataValueSymbol]: 5 } }
        )
      ).toEqual(40);
    });

    it('returns a number for a / MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: '/',
            right: 8,
            left: {
              unit: ['value'],
            },
          },
          { value: { [DataValueSymbol]: 5 } }
        )
      ).toEqual(5 / 8);
    });

    it('returns a number for a sum MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: 'sum',
            right: {
              unit: ['values'],
            },
          },
          { values: { [DataValueSymbol]: [1, 2, 3, 4] } }
        )
      ).toEqual(10);
    });

    it('returns a number for a avg MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: 'avg',
            right: {
              unit: ['values'],
            },
          },
          { values: { [DataValueSymbol]: [1, 2, 3, 4] } }
        )
      ).toEqual(10 / 4);
    });

    it('returns a number for a min MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: 'min',
            right: {
              unit: ['values'],
            },
          },
          { values: { [DataValueSymbol]: [1, 2, 3, 4] } }
        )
      ).toEqual(1);
    });

    it('returns a number for a max MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: 'max',
            right: {
              unit: ['values'],
            },
          },
          { values: { [DataValueSymbol]: [1, 2, 3, 4] } }
        )
      ).toEqual(4);
    });

    it('returns a number for a floor MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: 'floor',
            right: {
              condition: 'avg',
              right: {
                unit: ['values'],
              },
            },
          },
          { values: { [DataValueSymbol]: [1, 2, 3, 4] } }
        )
      ).toEqual(2);
    });

    it('returns a number for a ceil MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: 'ceil',
            right: {
              condition: 'avg',
              right: {
                unit: ['values'],
              },
            },
          },
          { values: { [DataValueSymbol]: [1, 2, 3, 4] } }
        )
      ).toEqual(3);
    });

    it('returns a number for a count MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: 'count',
            right: {
              unit: ['values'],
            },
          },
          { values: { [DataValueSymbol]: [1, 2, 3, 4, 5] } }
        )
      ).toEqual(5);
    });

    it('returns a number for a count with a filter MathConditional', () => {
      expect(
        resolveCheck(
          {
            condition: 'count',
            right: {
              condition: 'filter',
              left: {
                unit: ['values'],
              },
              right: {
                condition: '>',
                left: {
                  unit: [],
                },
                right: 2,
              },
            },
          },
          { values: { [DataValueSymbol]: [1, 2, 3, 4, 5] } }
        )
      ).toEqual(3);
    });
  });

  describe('BooleanConditionals', () => {
    describe('IAndConditional', () => {
      it('returns true for 5 != 4 AND 5 > 3', () => {
        expect(
          resolveCheck(
            {
              condition: 'and',
              right: [
                {
                  condition: '!=',
                  left: {
                    unit: ['value'],
                  },
                  right: 4,
                },
                {
                  condition: '>',
                  left: {
                    unit: ['value'],
                  },
                  right: 3,
                },
              ],
            },
            { value: { [DataValueSymbol]: 5 } }
          )
        ).toEqual(true);
      });

      it('returns false for 4 != 4 AND 4 > 3', () => {
        expect(
          resolveCheck(
            {
              condition: 'and',
              right: [
                {
                  condition: '!=',
                  left: {
                    unit: ['value'],
                  },
                  right: 4,
                },
                {
                  condition: '>',
                  left: {
                    unit: ['value'],
                  },
                  right: 3,
                },
              ],
            },
            { value: { [DataValueSymbol]: 4 } }
          )
        ).toEqual(false);
      });

      it('returns false for 3 != 4 AND 3 > 3', () => {
        expect(
          resolveCheck(
            {
              condition: 'and',
              right: [
                {
                  condition: '!=',
                  left: {
                    unit: ['value'],
                  },
                  right: 4,
                },
                {
                  condition: '>',
                  left: {
                    unit: ['value'],
                  },
                  right: 3,
                },
              ],
            },
            { value: { [DataValueSymbol]: 3 } }
          )
        ).toEqual(false);
      });
    });

    describe('IOrConditional', () => {
      it('returns true for 5 != 4 OR 5 > 3', () => {
        expect(
          resolveCheck(
            {
              condition: 'or',
              right: [
                {
                  condition: '!=',
                  left: {
                    unit: ['value'],
                  },
                  right: 4,
                },
                {
                  condition: '>',
                  left: {
                    unit: ['value'],
                  },
                  right: 3,
                },
              ],
            },
            { value: { [DataValueSymbol]: 5 } }
          )
        ).toEqual(true);
      });

      it('returns true for 4 != 4 OR 4 > 3', () => {
        expect(
          resolveCheck(
            {
              condition: 'or',
              right: [
                {
                  condition: '!=',
                  left: {
                    unit: ['value'],
                  },
                  right: 4,
                },
                {
                  condition: '>',
                  left: {
                    unit: ['value'],
                  },
                  right: 3,
                },
              ],
            },
            { value: { [DataValueSymbol]: 4 } }
          )
        ).toEqual(true);
      });

      it('returns true for 3 != 4 OR 3 > 3', () => {
        expect(
          resolveCheck(
            {
              condition: 'or',
              right: [
                {
                  condition: '!=',
                  left: {
                    unit: ['value'],
                  },
                  right: 4,
                },
                {
                  condition: '>',
                  left: {
                    unit: ['value'],
                  },
                  right: 3,
                },
              ],
            },
            { value: { [DataValueSymbol]: 3 } }
          )
        ).toEqual(true);
      });

      it('returns false for 4 != 4 OR 3 > 3', () => {
        expect(
          resolveCheck(
            {
              condition: 'or',
              right: [
                {
                  condition: '!=',
                  left: {
                    unit: ['value1'],
                  },
                  right: 4,
                },
                {
                  condition: '>',
                  left: {
                    unit: ['value2'],
                  },
                  right: 3,
                },
              ],
            },
            {
              value1: { [DataValueSymbol]: 4 },
              value2: { [DataValueSymbol]: 3 },
            }
          )
        ).toEqual(false);
      });
    });

    describe('IIfConditional', () => {
      it('returns true if value1(1) != 5 AND value2(2) = 2', () => {
        expect(
          resolveCheck(
            {
              condition: 'if',
              left: {
                condition: '!=',
                left: { unit: ['value1'] },
                right: 5,
              },
              right: {
                then: {
                  condition: '=',
                  left: { unit: ['value2'] },
                  right: 2,
                },
              },
            },
            {
              value1: { [DataValueSymbol]: 1 },
              value2: { [DataValueSymbol]: 2 },
            }
          )
        ).toEqual(true);
      });

      it('returns false if value1(1) != 5 AND value2(3) = 2', () => {
        expect(
          resolveCheck(
            {
              condition: 'if',
              left: {
                condition: '!=',
                left: { unit: ['value1'] },
                right: 5,
              },
              right: {
                then: {
                  condition: '=',
                  left: { unit: ['value2'] },
                  right: 2,
                },
              },
            },
            {
              value1: { [DataValueSymbol]: 1 },
              value2: { [DataValueSymbol]: 3 },
            }
          )
        ).toEqual(false);
      });

      it('returns true if value1(5) != 5 AND value2(2) = 2', () => {
        expect(
          resolveCheck(
            {
              condition: 'if',
              left: {
                condition: '!=',
                left: { unit: ['value1'] },
                right: 5,
              },
              right: {
                then: {
                  condition: '=',
                  left: { unit: ['value2'] },
                  right: 2,
                },
              },
            },
            {
              value1: { [DataValueSymbol]: 5 },
              value2: { [DataValueSymbol]: 2 },
            }
          )
        ).toEqual(true);
      });
    });

    describe('INotIfConditional', () => {
      it('returns true if value1(1) != 5 AND value2(2) = 2', () => {
        expect(
          resolveCheck(
            {
              condition: 'if',
              left: {
                condition: '!=',
                left: { unit: ['value1'] },
                right: 5,
              },
              right: {
                then: {
                  condition: '=',
                  left: { unit: ['value2'] },
                  right: 2,
                },
                else: false,
              },
            },
            {
              value1: { [DataValueSymbol]: 1 },
              value2: { [DataValueSymbol]: 2 },
            }
          )
        ).toEqual(true);
      });

      it('returns false if value1(1) != 5 AND value2(3) = 2', () => {
        expect(
          resolveCheck(
            {
              condition: 'if',
              left: {
                condition: '!=',
                left: { unit: ['value1'] },
                right: 5,
              },
              right: {
                then: {
                  condition: '=',
                  left: { unit: ['value2'] },
                  right: 2,
                },
                else: false,
              },
            },
            {
              value1: { [DataValueSymbol]: 1 },
              value2: { [DataValueSymbol]: 3 },
            }
          )
        ).toEqual(false);
      });

      it('returns false if value1(5) != 5 AND value2(2) = 2', () => {
        expect(
          resolveCheck(
            {
              condition: 'if',
              left: {
                condition: '!=',
                left: { unit: ['value1'] },
                right: 5,
              },
              right: {
                then: {
                  condition: '=',
                  left: { unit: ['value2'] },
                  right: 2,
                },
                else: false,
              },
            },
            {
              value1: { [DataValueSymbol]: 5 },
              value2: { [DataValueSymbol]: 2 },
            }
          )
        ).toEqual(false);
      });
    });

    describe('IEqConditional', () => {
      it('returns true if value(5) = 5', () => {
        expect(
          resolveCheck(
            {
              condition: '=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 5 },
            }
          )
        ).toEqual(true);
      });

      it('returns false if value(1) = 5', () => {
        expect(
          resolveCheck(
            {
              condition: '=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 1 },
            }
          )
        ).toEqual(false);
      });
    });

    describe('INotEqConditional', () => {
      it('returns false if value(5) != 5', () => {
        expect(
          resolveCheck(
            {
              condition: '!=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 5 },
            }
          )
        ).toEqual(false);
      });

      it('returns true if value(1) != 5', () => {
        expect(
          resolveCheck(
            {
              condition: '!=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 1 },
            }
          )
        ).toEqual(true);
      });
    });

    describe('IGtnConditional', () => {
      it('returns false if value(4) > 5', () => {
        expect(
          resolveCheck(
            {
              condition: '>',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 4 },
            }
          )
        ).toEqual(false);
      });

      it('returns false if value(5) > 5', () => {
        expect(
          resolveCheck(
            {
              condition: '>',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 5 },
            }
          )
        ).toEqual(false);
      });

      it('returns true if value(6) > 5', () => {
        expect(
          resolveCheck(
            {
              condition: '>',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 6 },
            }
          )
        ).toEqual(true);
      });
    });

    describe('IGtnEqConditional', () => {
      it('returns false if value(4) >= 5', () => {
        expect(
          resolveCheck(
            {
              condition: '>=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 4 },
            }
          )
        ).toEqual(false);
      });

      it('returns true if value(5) >= 5', () => {
        expect(
          resolveCheck(
            {
              condition: '>=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 5 },
            }
          )
        ).toEqual(true);
      });

      it('returns true if value(6) > 5', () => {
        expect(
          resolveCheck(
            {
              condition: '>=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 6 },
            }
          )
        ).toEqual(true);
      });
    });

    describe('ILtnConditional', () => {
      it('returns true if value(4) < 5', () => {
        expect(
          resolveCheck(
            {
              condition: '<',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 4 },
            }
          )
        ).toEqual(true);
      });

      it('returns false if value(5) < 5', () => {
        expect(
          resolveCheck(
            {
              condition: '<',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 5 },
            }
          )
        ).toEqual(false);
      });

      it('returns false if value(6) < 5', () => {
        expect(
          resolveCheck(
            {
              condition: '<',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 6 },
            }
          )
        ).toEqual(false);
      });
    });

    describe('ILtnEqConditional', () => {
      it('returns true if value(4) <= 5', () => {
        expect(
          resolveCheck(
            {
              condition: '<=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 4 },
            }
          )
        ).toEqual(true);
      });

      it('returns true if value(5) <= 5', () => {
        expect(
          resolveCheck(
            {
              condition: '<=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 5 },
            }
          )
        ).toEqual(true);
      });

      it('returns false if value(6) <= 5', () => {
        expect(
          resolveCheck(
            {
              condition: '<=',
              left: {
                unit: ['value'],
              },
              right: 5,
            },
            {
              value: { [DataValueSymbol]: 6 },
            }
          )
        ).toEqual(false);
      });
    });

    describe('IContainsConditional', () => {
      it('returns true if value(1,2,3,4,5) contains 5', () => {
        expect(
          resolveCheck(
            {
              condition: 'contains',
              left: [1, 2, 3, 4, 5],
              right: 5,
            },
            {}
          )
        ).toEqual(true);
      });

      it('returns false if value(1,2,3,4,5) contains 6', () => {
        expect(
          resolveCheck(
            {
              condition: 'contains',
              left: [1, 2, 3, 4, 5],
              right: 6,
            },
            {}
          )
        ).toEqual(false);
      });
    });

    describe('INotContainsConditional', () => {
      it('returns false if value(1,2,3,4,5) not contains 5', () => {
        expect(
          resolveCheck(
            {
              condition: 'not contains',
              left: [1, 2, 3, 4, 5],
              right: 5,
            },
            {}
          )
        ).toEqual(false);
      });

      it('returns true if value(1,2,3,4,5) not contains 6', () => {
        expect(
          resolveCheck(
            {
              condition: 'not contains',
              left: [1, 2, 3, 4, 5],
              right: 6,
            },
            {}
          )
        ).toEqual(true);
      });
    });

    describe('ILeastOfConditional', () => {
      it('returns false if 5 least of 1,2,3,4,5', () => {
        expect(
          resolveCheck(
            {
              condition: 'least of',
              left: 5,
              right: [1, 2, 3, 4, 5],
            },
            {}
          )
        ).toEqual(false);
      });

      it('returns true if 1 least of 1,2,3,4,5', () => {
        expect(
          resolveCheck(
            {
              condition: 'least of',
              left: 1,
              right: [1, 2, 3, 4, 5],
            },
            {}
          )
        ).toEqual(true);
      });
    });

    describe('IGreatestOfConditional', () => {
      it('returns true if 5 greatest of 1,2,3,4,5', () => {
        expect(
          resolveCheck(
            {
              condition: 'greatest of',
              left: 5,
              right: [1, 2, 3, 4, 5],
            },
            {}
          )
        ).toEqual(true);
      });

      it('returns false if 1 greatest of 1,2,3,4,5', () => {
        expect(
          resolveCheck(
            {
              condition: 'greatest of',
              left: 1,
              right: [1, 2, 3, 4, 5],
            },
            {}
          )
        ).toEqual(false);
      });
    });

    describe('IAnyLtnConditional', () => {
      it('returns true if 1,2,3,4,5 any < 6 ', () => {
        expect(
          resolveCheck(
            {
              condition: 'any <',
              left: [1, 2, 3, 4, 5],
              right: 6,
            },
            {}
          )
        ).toEqual(true);
      });

      it('returns false if 1,2,3,4,5 any < 1', () => {
        expect(
          resolveCheck(
            {
              condition: 'any <',
              left: [1, 2, 3, 4, 5],
              right: 1,
            },
            {}
          )
        ).toEqual(false);
      });
    });

    describe('IAnyLtnEqConditional', () => {
      it('returns false if 1,2,3,4,5 any <= 0 ', () => {
        expect(
          resolveCheck(
            {
              condition: 'any <=',
              left: [1, 2, 3, 4, 5],
              right: 0,
            },
            {}
          )
        ).toEqual(false);
      });

      it('returns true if 1,2,3,4,5 any <= 1 ', () => {
        expect(
          resolveCheck(
            {
              condition: 'any <=',
              left: [1, 2, 3, 4, 5],
              right: 1,
            },
            {}
          )
        ).toEqual(true);
      });
    });

    describe('IAnyGtnConditional', () => {
      it('returns false if 1,2,3,4,5 any > 6 ', () => {
        expect(
          resolveCheck(
            {
              condition: 'any >',
              left: [1, 2, 3, 4, 5],
              right: 6,
            },
            {}
          )
        ).toEqual(false);
      });

      it('returns true if 1,2,3,4,5 any > 1', () => {
        expect(
          resolveCheck(
            {
              condition: 'any >',
              left: [1, 2, 3, 4, 5],
              right: 1,
            },
            {}
          )
        ).toEqual(true);
      });
    });

    describe('IAnyGtnEqConditional', () => {
      it('returns false if 1,2,3,4,5 any >= 6 ', () => {
        expect(
          resolveCheck(
            {
              condition: 'any >=',
              left: [1, 2, 3, 4, 5],
              right: 6,
            },
            {}
          )
        ).toEqual(false);
      });

      it('returns true if 1,2,3,4,5 any >= 5 ', () => {
        expect(
          resolveCheck(
            {
              condition: 'any >=',
              left: [1, 2, 3, 4, 5],
              right: 5,
            },
            {}
          )
        ).toEqual(true);
      });
    });
  });
});
