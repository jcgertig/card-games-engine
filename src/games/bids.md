## Player Count
  - min: 3
  - max: 6
## Deck
### Count
  - 1
### Type (poker | hwatu)
  - poker
### (poker) Suit priority hi to low
  - H, S, D, C
### (poker) Card point value
  - 2:0, ..., Q: 0, ..., A:0, Joker:0
### (poker) Card priory hi to low
  - A, K, ..., 3, 2
### (poker) Joker
  - count: 0
  - role: not used
## Custom Card Groups
  - None
## Custom Values
  - TrumpSuit: [first] [deck] [suit]
  - MaxCards: [floor] [52] [/] [player] [count]
  - TrumpBroken: [all] [player] [played] [card(s)] [suit] [contains] [customValue] [TrumpSuit]
## Context Values
  - Bid: number
## Rounds
  - *:
    - Complete Conditions: [all] [player] [hand] [card(s)] [count] [matches] [0]
    - Next player: [clockwise]
    - Pass Cards: None
    - Deal: [value if] [customValue] [MaxCards] [>] [round] [count] _then_ [round] [count] [+] [1] _else_ [value if] [customValue] [MaxCards] [=] [round] [count] _then_ [round] [count] _else_ [round] [count] [-] [customValue] [MaxCards]
    - Discard: None
    - Draw: None
## Sub Rounds
  - *:
    - Win Conditions: [if] [all] [player] [played] [card(s)] [suit] [contains] [customValue] [TrumpSuit] [AND] [player] [played] [card(s)] [suit] [matches] [customValue] [TrumpSuit] _then_ [player] [played] [card(s)] [value] [+] [100] [greatest of] [all] [player] [played] [card(s)] [value] _else_ [player] [played] [card(s)] [value] [greatest of] [all] [player] [played] [card(s)] [value]
    - Player to start: [previous] [winner] [matches] [player]
    - Player to start plays:
      - hands: [single]
      - can skip: false
      - guard: [if] [customValue] [TrumpBroken] [matches] [false] _then_ [player] [played] [card(s)] [suit] [not matches] [customValue] [TrumpSuit]
    - Next player: [clockwise]
    - Following players can play:
      - hands: [single]
      - can skip: false
      - guard: [if] [player] [hand] [card(s)] [suit] [contains] [first player] [played] [card(s)] [suit] _then_ [player] [played] [card(s)] [suit] [matches] [first player] [played] [card(s)] [suit]
    - Pass Cards: None
    - Deal: None
    - Table: None
    - Discard: None
    - Draw: None
## Phases (play | discard | draw)
  - order: [play]
  - can skip to last phase: no
## Win conditions
  - [player] [points] [greatest of] [all] [player] [points]
## Points calculated
  - [player] [collected] [count] [+] [value if] [player] [collected] [count] [matches] [player] [context] [Bid] _then_ [10] _else_ [0]
## Game completed conditions
  - [round] [count] [=] [customValue] [MaxCards] [*] [2] [-] [1]