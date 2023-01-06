## Player Count
  - min: 4
  - max: 4
## Deck
### Count
  - 1
### Type (poker | hwatu)
  - poker
### (poker) Suit priority hi to low
  - S, H, C, D
### (poker) Card point value
  - 2:0, ..., A:0, Joker:0
### (poker) Card priory hi to low
  - 2, A, K, ..., 3, Jr
### (poker) Joker
  - count: 0
  - role: not used
## Custom Card Groups
  - None
## Custom Conditions
  - None
## Rounds
  - 0:
    - New Deck: true
    - Player to start: [player] [hand] [card(s)] [name(s)] [contains] [3D]
    - Player to start can play:
      - hands: [single, pair, three of a kind, poker hand]
      - can skip: false
      - guard: [player] [played] [cards(s)] [name(s)] [contains] [3D]
    - Next player: [clockwise]
    - Following players can play:
      - hands: [single, pair, three of a kind, poker hand]
      - can skip: true
      - can play after skip: true
      - guards: [ [player] [played] [cards(s)] [count] [matches] [previous] [player] [played] [cards(s)] [count] ] [and] [ [player] [played] [cards(s)] [value] [greater then] [previous] [player] [played] [cards(s)] [value] ] [and] [ [if] [player] [hand] [card(s)] [count] [matches] [0] _then_ [player] [played] [card(s)] [unit] [not contains] [2] ]
    - Win Conditions: [ [player] [hand] [cards] [count] [matches] [0] ] [or] [ [not if] [all] [player] [hand] [cards] [count] [not contains] [0] _then_ [player] [skipped] [matches] [false] ]
    - Complete Conditions: [ [all] [player] [hand] [cards] [count] [contains] [0] ] [or] [ [ [filter] [all] [player] [skipped] _by_ [matches] [true] ] [count] ] [matches] [3]
    - Pass Cards: None
    - Deal: All
    - Discard: None
    - Draw: None
  - *:
    - New Deck: false
    - Player to start: [previous] [winner] [matches] [player]
    - Player to start plays:
      - hands: [single, pair, three of a kind, or poker hand]
      - can skip: false
      - guard: [if] [player] [hand] [card(s)] [count] [matches] [0] _then_ [player] [played] [card(s)] [unit] [2]
    - Next player: [clockwise]
    - Following players can play:
      - hands: [single, pair, three of a kind, poker hand]
      - can skip: true
      - can play after skip: true
      - guards: [ [player] [played] [cards(s)] [count] [matches] [previous] [player] [played] [cards(s)] [count] ] [and] [ [player] [played] [cards(s)] [value] [greater then] [previous] [player] [played] [cards(s)] [value] ] [and] [ [if] [player] [hand] [card(s)] [count] [matches] [0] _then_ [player] [played] [card(s)] [unit] [not contains] [2] ]
    - Win Conditions: [ [player] [hand] [cards] [count] [matches] [0] ] [or] [ [not if] [all] [player] [hand] [cards] [count] [not contains] [0] _then_ [player] [skipped] [matches] [false] ]
    - Complete Conditions: [ [all] [player] [hand] [cards] [count] [contains] [0] ] [or] [ [ [filter] [all] [player] [skipped] _by_ [matches] [true] ] [count] ] [matches] [3]
    - Pass Cards: None
    - Deal: All
    - Discard: None
    - Draw: None
## Phases (play | discard | draw | deal)
  - order: [play]
  - can skip to last phase: no
## Win conditions
  - [player] [hand] [cards] [count] [matches] [0]
## Points calculated
  - None
## Completed conditions
  - [all] [player] [hand] [cards] [count] [contains] [0]