<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@card-games/engine](./engine.md) &gt; [Game](./engine.game.md)

## Game class

<b>Signature:</b>

```typescript
export declare class Game 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(options)](./engine.game._constructor_.md) |  | Constructs a new instance of the <code>Game</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [addPlayer](./engine.game.addplayer.md) |  | (playerId: string) =&gt; void |  |
|  [call](./engine.game.call.md) |  | (playerIdx: number) =&gt; void |  |
|  [canAddPlayer](./engine.game.canaddplayer.md) | <code>readonly</code> | boolean |  |
|  [canCall](./engine.game.cancall.md) | <code>readonly</code> | any |  |
|  [canDiscard](./engine.game.candiscard.md) | <code>readonly</code> | any |  |
|  [canDraw](./engine.game.candraw.md) | <code>readonly</code> | any |  |
|  [canPass](./engine.game.canpass.md) | <code>readonly</code> | boolean |  |
|  [canPlace](./engine.game.canplace.md) | <code>readonly</code> | any |  |
|  [canPlay](./engine.game.canplay.md) | <code>readonly</code> | any |  |
|  [canSkip](./engine.game.canskip.md) | <code>readonly</code> | any |  |
|  [canStart](./engine.game.canstart.md) | <code>readonly</code> | boolean |  |
|  [checkAllowedPlay](./engine.game.checkallowedplay.md) |  | (cards: Array&lt;string&gt;, target: [IPlayTarget](./engine.iplaytarget.md)<!-- -->, otherPlayerIdx?: number \| undefined) =&gt; boolean |  |
|  [currentDealerIdx](./engine.game.currentdealeridx.md) | <code>readonly</code> | number |  |
|  [currentPlayConditions](./engine.game.currentplayconditions.md) | <code>readonly</code> | [IRoundPlayConditions](./engine.iroundplayconditions.md) |  |
|  [currentPlayerData](./engine.game.currentplayerdata.md) | <code>readonly</code> | IGamePlayer |  |
|  [currentPlayerId](./engine.game.currentplayerid.md) | <code>readonly</code> | string |  |
|  [currentPlayerIdx](./engine.game.currentplayeridx.md) | <code>readonly</code> | number |  |
|  [deal](./engine.game.deal.md) |  | () =&gt; { players: string\[\]\[\]; table: string\[\]; } |  |
|  [discard](./engine.game.discard.md) |  | (cards: Array&lt;string&gt;) =&gt; void |  |
|  [done](./engine.game.done.md) |  | () =&gt; void |  |
|  [draw](./engine.game.draw.md) |  | (fromDiscard: boolean) =&gt; void |  |
|  [drawTargets](./engine.game.drawtargets.md) | <code>readonly</code> | ("deck" \| "discard")\[\] |  |
|  [gameComplete](./engine.game.gamecomplete.md) | <code>readonly</code> | any |  |
|  [isActive](./engine.game.isactive.md) | <code>readonly</code> | boolean |  |
|  [pass](./engine.game.pass.md) |  | (playerIdx: number, cards: Array&lt;string&gt;) =&gt; void |  |
|  [passDirection](./engine.game.passdirection.md) | <code>readonly</code> | [INextDirection](./engine.inextdirection.md) |  |
|  [place](./engine.game.place.md) |  | (cards: Array&lt;string&gt;) =&gt; void |  |
|  [play](./engine.game.play.md) |  | (cards: Array&lt;string&gt;, target?: [IPlayTarget](./engine.iplaytarget.md)<!-- -->, otherPlayerIdx?: number \| undefined) =&gt; void |  |
|  [previousPlayedCards](./engine.game.previousplayedcards.md) | <code>readonly</code> | Array&lt;string&gt; |  |
|  [resolveCheckCurrentUser](./engine.game.resolvecheckcurrentuser.md) |  | (conditional: [IResolveConditional](./engine.iresolveconditional.md)<!-- -->, other?: any) =&gt; any |  |
|  [roundComplete](./engine.game.roundcomplete.md) | <code>readonly</code> | any |  |
|  [roundWinner](./engine.game.roundwinner.md) | <code>readonly</code> | string \| undefined |  |
|  [roundWon](./engine.game.roundwon.md) | <code>readonly</code> | boolean |  |
|  [setPlayerContextFlag](./engine.game.setplayercontextflag.md) |  | (flag: string, value: [IPlayerContextValue](./engine.iplayercontextvalue.md)<!-- -->, playerIdx?: number \| undefined) =&gt; void |  |
|  [setPlayerContextFlags](./engine.game.setplayercontextflags.md) |  | (context: [IPlayerContext](./engine.iplayercontext.md)<!-- -->, playerIdx?: number \| undefined) =&gt; void |  |
|  [skip](./engine.game.skip.md) |  | () =&gt; void |  |
|  [start](./engine.game.start.md) |  | () =&gt; "passCards" \| "start" |  |
|  [subRoundComplete](./engine.game.subroundcomplete.md) | <code>readonly</code> | any |  |
|  [useSubRounds](./engine.game.usesubrounds.md) | <code>readonly</code> | boolean |  |
|  [winner](./engine.game.winner.md) | <code>readonly</code> | string \| undefined |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [asJSON()](./engine.game.asjson.md) |  |  |
