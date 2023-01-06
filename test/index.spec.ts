import * as exportList from '../src';

describe('index', () => {
  describe('export', () => {
    it('should export expected', () => {
      expect(Object.keys(exportList).sort()).toEqual([
        'Card',
        'Deck',
        'Game',
        'findPlayableHand',
        'games',
      ]);
    });

    it('should export expected game configs', () => {
      expect(Object.keys(exportList.games).sort()).toEqual([
        'bids',
        'deuces',
        'hearts',
      ]);
    });
  });
});
