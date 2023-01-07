/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { deuces } from '../src/games';
import { findPlayableHand } from '../src/logic/findPlayableHand';
import { Game } from '../src/logic/game';

function getRoundData(game: Game, roundIdx?: number) {
  const gameData = game.asJSON();
  return gameData.rounds[
    typeof roundIdx === 'number' ? roundIdx : gameData.currentRoundIdx
  ];
}

function getGame() {
  return new Game({ config: deuces, playerIds: ['1', '2', '3'] });
}

function getReadyGame() {
  const game = getGame();
  game.addPlayer('4');
  game.start();
  return game;
}

describe('Game class (deuces)', () => {
  test('create new Game', () => {
    expect(getGame()).toBeInstanceOf(Game);
  });

  test('should error without the minimum number of players', () => {
    const game = getGame();
    try {
      game.start();
      expect(true).toEqual(false);
    } catch (error) {
      expect((error as any).message).toEqual('Not able to start the game');
    }
  });

  test('should be able to add a player when less the the max', () => {
    const game = getGame();
    game.addPlayer('4');
    expect(game.asJSON().playerIds).toEqual(['1', '2', '3', '4']);
  });

  test('should be not able to add a player when more the the max', () => {
    const game = getGame();
    game.addPlayer('4');
    expect(game.asJSON().playerIds).toEqual(['1', '2', '3', '4']);
    try {
      game.addPlayer('5');
      expect(true).toEqual(false);
    } catch (error) {
      expect((error as any).message).toEqual('Can no longer add players');
    }
  });

  test('should be able to start a game', () => {
    const game = getGame();
    game.addPlayer('4');
    try {
      game.start();
      expect(game.asJSON().rounds.length).toEqual(1);
    } catch (error) {
      expect((error as any).message).toEqual('Not able to start the game');
    }
  });

  test('should be able to play the 3D', () => {
    const game = getReadyGame();
    game.play(['3D']);
    const gameData = game.asJSON();
    const roundData = gameData.rounds[0];
    expect(roundData.players[roundData.firstPlayerIdx].played).toEqual([
      ['3D'],
    ]);
  });

  test('should fail for first play to not have 3D', () => {
    const game = getReadyGame();
    try {
      game.play(['4D']);
      expect(true).toEqual(false);
    } catch (error) {
      // console.log('error', error);
      expect((error as any).message).toEqual(
        'This type of hand is not allowed'
      );
    }
  });

  test('should be able to complete a play as player one', () => {
    const game = getReadyGame();
    game.play(['3D']);
    game.done();
    const roundData = getRoundData(game);
    const nextIdx = roundData.firstPlayerIdx - 1;
    expect(roundData.currentPlayerIdx).toEqual(
      nextIdx < 0 ? roundData.players.length - 1 : nextIdx
    );
  });

  test('should be able to skip a play as player two', () => {
    const game = getReadyGame();
    game.play(['3D']);
    game.done();
    game.skip();
    game.done();
    const roundData = getRoundData(game);
    expect(roundData.turnIdx).toEqual(2);
  });

  test('should be able to play a round till there is a winner', () => {
    const game = getReadyGame();
    let roundData = getRoundData(game, 0);
    while (typeof roundData.winner === 'undefined') {
      const hand = findPlayableHand(game);
      if (hand === null) {
        // console.log('skip');
        game.skip();
      } else {
        // console.log('play', hand);
        game.play(hand);
      }
      game.done();
      roundData = getRoundData(game, 0);
    }
    expect(typeof roundData.winner).toEqual('number');
  });

  test('should complete a round based on skips', () => {
    const game = getReadyGame();
    game.play(['3D']);
    game.done();

    game.skip();
    game.done();

    game.skip();
    game.done();

    game.skip();

    expect(
      game.resolveCheckCurrentUser(
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        deuces.rounds.order['*']?.completeConditions!
      )
    ).toBe(true);
  });

  test('should be able to play till there is a winner', () => {
    const game = getReadyGame();
    while (!game.asJSON().complete) {
      const hand = findPlayableHand(game);
      if (hand === null) {
        // console.log('skip');
        game.skip();
      } else {
        // console.log('play', hand);
        game.play(hand);
      }
      game.done();
    }
    expect(typeof game.winner).toEqual('string');
  });
});
