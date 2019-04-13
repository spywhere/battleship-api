# Specifications

## App

### Health Check

Request

```
GET /
```

Response

```
200 OK
content-type: application/json

{
    "timestamp": string // current date and time
}
```


## Game

### Get current game state

Request

```
GET /api
```

Response

```
200 OK
content-type: application/json

{
    "state": "placement" | "attack" | "gameover",
    "board": [
        [
            {
                "type": "battleship" | "cruiser" | "destroyer" | "submarine" | "ocean",
                "status": "placed" | "attacked"
            },
            ... // columns
        ],
        ... // rows
    ],
    "visual": string[]  // A visual representation of current game state
}
```

### Reset the game to an initial state

Request

```
POST /api/reset
```

Response

```
200 OK
content-type: application/json

{
    "status": string
}
```


## Defender

### Place a single ship

Request

```
POST /api/ship
content-type: application/json

{
    "type": "battleship" | "cruiser" | "destroyer" | "submarine",
    "position_x": number, // between 0 and max board width - 1
    "position_y": number, // between 0 and max board height - 1
    "direction": "horizontal" | "vertical" = "horizontal"
}
```

Response

```
200 OK
content-type: application/json

{
    "status": string
}
```


## Attacker

### Attack to a specific target

Request

```
POST /api/attack
content-type: application/json

{
    "position_x": number, // between 0 and max board width - 1
    "position_y": number, // between 0 and max board height - 1
}
```

Response

```
200 OK
content-type: application/json

{
    "status": string,
    "shots_fired": number,
    "missed_shots": number
}
```

