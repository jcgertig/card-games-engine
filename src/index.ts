import * as baseGames from './games';
export * from './logic/findPlayableHand';
export * from './logic/game';
export * from './logic/deck';

export * from './types/game-config';
export * from './types/deck-config';
export * from './types/conditional';

export const games = { ...baseGames };
