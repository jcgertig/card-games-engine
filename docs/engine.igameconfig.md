<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@card-games/engine](./engine.md) &gt; [IGameConfig](./engine.igameconfig.md)

## IGameConfig interface

<b>Signature:</b>

```typescript
export interface IGameConfig 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [completeConditions](./engine.igameconfig.completeconditions.md) |  | [IBooleanConditional](./engine.ibooleanconditional.md) |  |
|  [customValues?](./engine.igameconfig.customvalues.md) |  | { \[key: string\]: [IResolveConditional](./engine.iresolveconditional.md)<!-- -->; } | <i>(Optional)</i> |
|  [deck?](./engine.igameconfig.deck.md) |  | { count?: number \| [IMathConditional](./engine.imathconditional.md)<!-- -->; } &amp; [IDeckConfig](./engine.ideckconfig.md) | <i>(Optional)</i> |
|  [defaultPlayerContext?](./engine.igameconfig.defaultplayercontext.md) |  | [IPlayerContext](./engine.iplayercontext.md) | <i>(Optional)</i> |
|  [nextDealer?](./engine.igameconfig.nextdealer.md) |  | [INextDirection](./engine.inextdirection.md) | <i>(Optional)</i> |
|  [phases](./engine.igameconfig.phases.md) |  | { order: Array&lt;'play' \| 'discard' \| 'draw'&gt;; canSkipToLast?: boolean; } |  |
|  [playerCount](./engine.igameconfig.playercount.md) |  | { min: number; max: number; } |  |
|  [roundPointCalculation?](./engine.igameconfig.roundpointcalculation.md) |  | [IMathConditional](./engine.imathconditional.md) | <i>(Optional)</i> |
|  [rounds](./engine.igameconfig.rounds.md) |  | { order: [OrderEntryConfig](./engine.orderentryconfig.md)<!-- -->&lt;[IRoundsConfig](./engine.iroundsconfig.md)<!-- -->&gt;; } |  |
|  [useSubRounds?](./engine.igameconfig.usesubrounds.md) |  | boolean | <i>(Optional)</i> |
|  [winConditions](./engine.igameconfig.winconditions.md) |  | [IBooleanConditional](./engine.ibooleanconditional.md) |  |
