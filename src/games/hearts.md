## Player Count
  - min: 4
  - max: 4
## Deck
### Count
  - 1
### Type (poker | hwatu)
  - poker
### (poker) Suit priority hi to low
  - H, S, D, C
### (poker) Card point value
  - 2:{ H: 1, S: 0, D: 0, C: 0}, ..., Q: {H: 1, S: 13, D: 0, C: 0}, ..., A:{H: 1, S: 0, D: 0, C: 0}, Joker:0
### (poker) Card priory hi to low
  - A, K, ..., 3, 2
### (poker) Joker
  - count: 0
  - role: not used
## Custom Card Groups
  - None
## Custom Values
  - HeartsBroken: [all] [player] [played] [card(s)] [suit] [contains] [H]
## Games
  - *:
    - win conditions: [player] [points] [least of] [all] [player] [points]
    - complete conditions: [all] [player] [hand] [card(s)] [count] [contains] [0]
## Rounds
  - 0:
    - Win Conditions: [player] [played] [count] [matches] [4] [AND] [player] [played] [card(s)] [value] [greatest of] [all] [player] [played] [card(s)] [value] [where] [player] [played] [card(s)] [suit] [matches] [first player] [played] [card(s)] [suit]
    - Player to start: [player] [hand] [card(s)] [name] [contains] [2C]
    - Player to start can play:
      - hands: [single]
      - can skip: false
      - guard: [player] [played] [card(s)] [name] [contains] [2C]
    - Next player: [clockwise]
    - Following players can play:
      - hands: [single]
      - can skip: false
      - guard: [if] [player] [hand] [card(s)] [suit] [contains] [first player] [played] [card(s)] [suit] _then_ [player] [played] [card(s)] [suit] [matches] [first player] [played] [card(s)] [suit]
    - Pass Cards: None
    - Deal: All
    - Discard: None
    - Draw: None
  - *:
    - Win Conditions: [player] [played] [count] [matches] [4] [AND] [player] [played] [card(s)] [value] [greatest of] [all] [player] [played] [card(s)] [value]
    - Player to start: [previous] [winner] [matches] [player]
    - Player to start plays:
      - hands: [single]
      - can skip: false
      - guard: [if] [customValue] [HeartsBroken] [matches] [false] _then_ [player] [played] [card(s)] [suit] [not matches] [H]
    - Next player: [clockwise]
    - Following players can play:
      - hands: [single]
      - can skip: false
      - guard: [if] [player] [hand] [card(s)] [suit] [contains] [first player] [played] [card(s)] [suit] _then_ [player] [played] [card(s)] [suit] [matches] [first player] [played] [card(s)] [suit]
    - Pass Cards: 
      - direction: [left, right, across, none]
      - count: 3
    - Deal: All
    - Discard: None
    - Draw: None
## Phases (play | discard | draw)
  - order: [play]
  - can skip to last phase: no
## Win conditions
  - [player] [points] [least of] [all] [player] [points]
## Points calculated
  - [sum] [player] [collected] [card(s)] [points]
## Game completed conditions
  - [all] [player] [points] [any greater then or equal to] [100]