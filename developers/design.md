# Data Structure Design

As a game is a grid-based system, we will treat each tile as an individual
record on the database system. For the simplicity purpose, in this repository will only run with the following data collections / tables below.

## Data Collections / Tables

### `board_tile`

A collection to keep track of what and where is the tile on the board, a lack of one would considered as a free tile (ocean)

Column|Type|Description
:-:|:-:|---
_id_|UID|Auto-generated
is_ship_head|boolean|A flag to indicate if the tile is a placement position
ship_id|string|Ship identifier (for this project, is placement coordinate)
tile_type|string|Tile type (fleet type)
position_x|int|Position from the left of the board
position_y|int|Position from the top of the board
status|string|Tile status (placed, destroyed)

### `battle_log`

A collection to keep track of who doing what and where on the board

Column|Type|Description
:-:|:-:|---
_id_|UID|Auto-generated
tile_type|string|Tile type (fleet type)
position_x|int|Position from the left of the board
position_y|int|Position from the top of the board
action|string|Action performed by the player (place, attack)

## Scaling the game

To add support for concurrent games, new tile style, there will be changes needed on the collection / table structure. The following changes are solely for example purpose...

1. A new collection / table for individual board.  

A basic example for `board` collection / table

Column|Type|Description
:-:|:-:|---
_id_|UID|Auto-generated
start_timestamp|timestamp|A starting time for a new game

2. A new collection / table for more player information

3. A new collection / table for more tile type

4. Changes for `board_tile` and `battle_log` collection / table to support more flexible game mechanics

A basic example for `board_tile` collection / table changes

Action|Column|Type|Description
:-:|:-:|:-:|---
Add column|board_id|UID|Board reference number
Add column|player_id|UID|Player reference number
Add column|tile_id|UID|Tile reference number
Remove column|tile_type|string|Tile type (fleet type)

A basic example for `battle_log` collection / table changes

Action|Column|Type|Description
:-:|:-:|:-:|---
Add column|board_id|UID|Board reference number
Add column|player_id|UID|Player reference number
Add column|tile_id|UID|Tile reference number
Remove column|tile_type|string|Tile type (fleet type)
