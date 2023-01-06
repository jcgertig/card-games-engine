import * as baseGames from './games';
export * from './logic/findPlayableHand';
export * from './logic/game';
export * from './logic/deck';

export const games = { ...baseGames };
