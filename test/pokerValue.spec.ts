import { deuces } from '../src/games';
import { Card } from '../src/logic/deck';
import { handBaseValue, pokerValue } from '../src/logic/pokerValue';

const toCards = (arr: string[]) => arr.map(i => new Card(i, deuces.deck));

describe('Card class', () => {
  test('value of 3D should be 0', () => {
    expect(pokerValue(toCards(['3D']))).toEqual(0);
  });

  test('value of 2S should be 123', () => {
    expect(pokerValue(toCards(['2S']))).toEqual(123);
  });

  test('value of 10C,10H to have a higher value then 4S,4C', () => {
    expect(pokerValue(toCards(['10C', '10H']))).toBeGreaterThan(
      pokerValue(toCards(['4S', '4C']))
    );
  });

  test('value of 2D,8D,2C,8H,2H to have a higher value then 8C,10C,10H,8S,10D', () => {
    expect(pokerValue(toCards(['2D', '8D', '2C', '8H', '2H']))).toBeGreaterThan(
      pokerValue(toCards(['8C', '10C', '10H', '8S', '10D']))
    );
  });

  test('value of 2S,2D,3C,AH,5D should be 123 + pair base value', () => {
    expect(pokerValue(toCards(['2S', '2D', '3C', 'AH', '5D']))).toEqual(
      123 + handBaseValue.pair
    );
  });

  // test('value of 2S,2D,3C,AH,5D should be 123 + pair base value', () => {
  //   expect(pokerValue(toCards(['2S', '2D', '3C', 'AH', '5D']))).toEqual(
  //     123 + handBaseValue.pair
  //   );
  // });

  test('value of AS,KD,QC,JH,10D should be 113 + straight base value', () => {
    expect(pokerValue(toCards(['AS', 'KD', 'QC', 'JH', '10D']))).toEqual(
      113 + handBaseValue.straight
    );
  });

  test('value of AS,KS,QS,JS,10S should be 113 + royal flush base value', () => {
    expect(pokerValue(toCards(['AS', 'KS', 'QS', 'JS', '10S']))).toEqual(
      113 + handBaseValue.royalFlush
    );
  });

  test('value of AS,2S,3S,4S,5S should be 123 + straight flush base value', () => {
    expect(pokerValue(toCards(['AS', '2S', '3S', '4S', '5S']))).toEqual(
      123 + handBaseValue.straightFlush
    );
  });

  test('value of AS,3S,6S,8S,10S should be 113 + flush base value', () => {
    expect(pokerValue(toCards(['AS', '3S', '6S', '8S', '10S']))).toEqual(
      113 + handBaseValue.flush
    );
  });

  test('value of AS,3D,6C,8S,10S should be 113', () => {
    expect(pokerValue(toCards(['AS', '3D', '6C', '8S', '10S']))).toEqual(113);
  });

  test('value of AS,AD,AC,AH,10S should be 113 + four of a kind base value', () => {
    expect(pokerValue(toCards(['AS', 'AD', 'AC', 'AH', '10S']))).toEqual(
      113 + handBaseValue.fourOfAKind
    );
  });

  test('value of AS,AD,AC,9H,10S should be 113 + three of a kind base value', () => {
    expect(pokerValue(toCards(['AS', 'AD', 'AC', '9H', '10S']))).toEqual(
      113 + handBaseValue.threeOfAKind
    );
  });

  test('value of AS,AD,9C,9H,10S should be 113 + two pair base value', () => {
    expect(pokerValue(toCards(['AS', 'AD', '9C', '9H', '10S']))).toEqual(
      113 + handBaseValue.twoPair
    );
  });
});
