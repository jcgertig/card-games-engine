import { deuces } from '../src/games';
import { validHand, validPokerHand } from '../src/logic/checkHand';

describe('validPokerHand', () => {
  test('is not valid with < 5 cards', () => {
    expect(validPokerHand(['3H', '5C', '6D', '7S'], deuces.deck)).toEqual(
      false
    );
  });
  test('straight to be valid (3,4,5,6,7)', () => {
    expect(validPokerHand(['3H', '5C', '6D', '7S', '4H'], deuces.deck)).toEqual(
      true
    );
  });

  test('flush to be valid (3H,4H,6H,7H,9H)', () => {
    expect(validPokerHand(['3H', '4H', '6H', '7H', '9H'], deuces.deck)).toEqual(
      true
    );
  });

  test('full house to be valid (2H,2C,2D,7H,7C)', () => {
    expect(validPokerHand(['2H', '2C', '2D', '7H', '7C'], deuces.deck)).toEqual(
      true
    );
  });

  test('four of a kind to be valid (3H,3S,3C,3D,9H)', () => {
    expect(validPokerHand(['3H', '3S', '3C', '3D', '9H'], deuces.deck)).toEqual(
      true
    );
  });

  test('straight to be valid (AH,KS,QC,JD,10H)', () => {
    expect(
      validPokerHand(['AH', 'KS', 'QC', 'JD', '10H'], deuces.deck)
    ).toEqual(true);
  });

  test('straight to be valid (AH,2S,3C,4D,5H)', () => {
    expect(validPokerHand(['AH', '2S', '3C', '4D', '5H'], deuces.deck)).toEqual(
      true
    );
  });

  test('five cards to not be valid (AH,2S,3C,6D,5H)', () => {
    try {
      validPokerHand(['AH', '2S', '3C', '6D', '5H'], deuces.deck);
    } catch (err: any) {
      expect(err?.message).toEqual('Missing cards for a valid straight');
    }
  });

  test('five cards to not be valid starting with an ace (AH,3S,4C,5D,6H)', () => {
    try {
      validPokerHand(['AH', '3S', '4C', '5D', '6H'], deuces.deck);
    } catch (err: any) {
      expect(err?.message).toEqual('Missing cards for a valid straight');
    }
  });
});

describe('validHand', () => {
  test('should return true for "any" hand', () => {
    expect(validHand([], ['any'], deuces.deck)).toEqual(true);
  });

  test('should return true for 1 hand', () => {
    expect(validHand(['AH'], [1], deuces.deck)).toEqual(true);
  });
  test('should return false for one card and only 2 allowed hand', () => {
    expect(validHand(['AH'], [2], deuces.deck)).toEqual(false);
  });

  test('should return true for 2 hand', () => {
    expect(validHand(['AH', 'AS'], [2], deuces.deck)).toEqual(true);
  });
  test('should return false for two cards and only 1 allowed hand', () => {
    expect(validHand(['AH', 'AS'], [1], deuces.deck)).toEqual(false);
  });

  test('should return true for 3 hand', () => {
    expect(validHand(['AH', 'AS', 'AD'], [3], deuces.deck)).toEqual(true);
  });
  test('should return false for two cards and only 2 allowed hand', () => {
    expect(validHand(['AH', 'AS', 'AD'], [2], deuces.deck)).toEqual(false);
  });

  test('should return true for 4 hand', () => {
    expect(validHand(['AH', 'AS', 'AD', 'AC'], [4], deuces.deck)).toEqual(true);
  });
  test('should return false for two cards and only 3 allowed hand', () => {
    expect(validHand(['AH', 'AS', 'AD', 'AC'], [3], deuces.deck)).toEqual(
      false
    );
  });

  test('should return true for "poker" hand', () => {
    expect(
      validHand(['AH', 'AS', 'AD', 'AC', '2C'], ['poker'], deuces.deck)
    ).toEqual(true);
  });
  test('should error bad poker hand', () => {
    try {
      validHand(['AH', 'AS', 'AD', '3C', '2C'], ['poker'], deuces.deck);
    } catch (err: any) {
      expect(err?.message).toEqual('Can not have sets in a straight');
    }
  });
  test('should return false for five cards and only 4 allowed hand', () => {
    expect(validHand(['AH', 'AS', 'AD', 'AC', '2C'], [4], deuces.deck)).toEqual(
      false
    );
  });

  test('should return true for "straight" flush of length 4 min length 3 hand', () => {
    expect(
      validHand(
        ['AH', 'KH', 'QH', 'JH'],
        [{ kind: 'straight', count: 3, allowMore: true, flush: true }],
        deuces.deck
      )
    ).toEqual(true);
  });

  test('should return true for "straight" of length 3 hand', () => {
    expect(
      validHand(
        ['AH', 'KC', 'QS'],
        [{ kind: 'straight', count: 3 }],
        deuces.deck
      )
    ).toEqual(true);
  });

  test('should return false for "straight" flush of length 4 fixed length 3 hand', () => {
    expect(
      validHand(
        ['AH', 'KH', 'QH', 'JH'],
        [{ kind: 'straight', count: 3, allowMore: false, flush: true }],
        deuces.deck
      )
    ).toEqual(false);
  });

  test('should return false for "straight" not flush of length 4 hand', () => {
    expect(
      validHand(
        ['AH', 'KH', 'QC', 'JD'],
        [{ kind: 'straight', count: 4, flush: true }],
        deuces.deck
      )
    ).toEqual(false);
  });

  test('should return true for "straight" flush of with a Joker 3 hand', () => {
    expect(
      validHand(
        ['AH', 'Joker', 'QH', 'JH'],
        [{ kind: 'straight', count: 3, allowMore: true, flush: true }],
        deuces.deck
      )
    ).toEqual(true);
  });
  test('should return false for "straight" flush with 2 Jokers hand', () => {
    try {
      validHand(
        ['AH', 'Joker', 'Joker', 'JH'],
        [{ kind: 'straight', count: 3, allowMore: true, flush: true }],
        deuces.deck
      );
    } catch (err: any) {
      expect(err?.message).toEqual(
        'Can not have more than 1 wild card(s) in a row'
      );
    }
  });
});
