import { IPlayTarget, IValidHands } from '../types/game-config';
import { Game } from './game';

function uniqueCombinations(input: Array<string>, len: number) {
  let entries = input.reduce((map, value, idx) => {
    map.set(`${idx}`, [value]);
    return map;
  }, new Map<string, any[]>());
  for (let i = 1; i < len; i += 1) {
    const newEntries = new Map();
    for (const [key, values] of entries.entries()) {
      for (let x = 0; x < input.length; x += 1) {
        const newKey = [...new Set([...key.split('-'), `${x}`])].sort();
        const newKeyFull = newKey.join('-');
        if (newKey.length === i + 1 && !newEntries.has(newKeyFull)) {
          newEntries.set(newKeyFull, [...values, input[x]]);
        }
      }
    }
    entries = newEntries;
  }
  return [...entries.values()];
}

/**
 * Returns a valid playable hand for current game user
 *
 * @export
 * @param {Game} game
 * @param {IPlayTarget} [target='table']
 * @returns {(string[] | null)}
 */
export function findPlayableHand(
  game: Game,
  target: IPlayTarget = 'table'
): string[] | null {
  const playerHand = game.currentPlayerData.hand;
  const lastPlayedCards = game.previousPlayedCards;
  let options: Array<Array<string>> = [];
  if (lastPlayedCards.length > 0) {
    options = uniqueCombinations(playerHand, lastPlayedCards.length);
    try {
      for (const option of options) {
        if (game.checkAllowedPlay(option, target)) {
          return option;
        }
      }
    } catch (err) {
      // noop
    }
    return null;
  }

  // never played before
  const conditions = game.currentPlayConditions;
  const checked: any[] = [];
  const ifCheck = (inc: IValidHands, handInc?: IValidHands) =>
    !checked.includes(inc) &&
    options.length === 0 &&
    (conditions.hands.includes(handInc || (inc as any)) ||
      conditions.hands.includes('any'));
  const elseCheck = (inc: IValidHands, handInc?: IValidHands) =>
    !checked.includes(inc) &&
    !conditions.hands.includes(handInc || (inc as any));

  const check = (inc: number, handInc?: IValidHands) => {
    if (ifCheck(inc, handInc)) {
      checked.push(inc);
      options = uniqueCombinations(playerHand, inc);
    } else if (elseCheck(inc, handInc)) {
      checked.push(inc);
    }
  };

  while (checked.length < 5) {
    check(5, 'poker');
    check(4);
    check(3);
    check(2);
    check(1);

    for (const option of options) {
      try {
        if (game.checkAllowedPlay(option, target)) {
          return option;
        }
      } catch (err) {
        // NOOP
      }
    }
    options = [];
  }
  return null;
}
