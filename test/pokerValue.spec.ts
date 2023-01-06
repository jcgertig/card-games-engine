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
});
