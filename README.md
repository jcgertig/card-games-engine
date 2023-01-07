# @card-games/engine

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> My awesome module

## Install

```bash
npm install @card-games/engine
```

## Usage

```ts
import { Game, games } from '@card-games/engine';

const game = new Game({ config: games.deuces, playerIds: ['A', 'B', 'C', 'D'] });
game.start();

game.play(['3D']);
game.done();

game.skip();
game.done();

game.skip();
game.done();

game.skip();
game.done();

console.log("Round winner", game.roundWinner); // dependent on the player who had the 3D
```

## API

## Packages

|  Package | Description |
|  --- | --- |
|  [@card-games/engine](./docs/engine.md) |  |

[build-img]:https://github.com/jcgertig/card-games-engine/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/jcgertig/card-games-engine/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/@card-games/engine
[downloads-url]:https://www.npmtrends.com/@card-games/engine
[npm-img]:https://img.shields.io/npm/v/@card-games/engine
[npm-url]:https://www.npmjs.com/package/@card-games/engine
[issues-img]:https://img.shields.io/github/issues/jcgertig/card-games-engine
[issues-url]:https://github.com/jcgertig/card-games-engine/issues
[codecov-img]:https://codecov.io/gh/jcgertig/card-games-engine/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/jcgertig/card-games-engine
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
