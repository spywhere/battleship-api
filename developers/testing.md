# Testing

## Unit Tests

This project implemented with unit tests, you can easily run all the tests
by running...

```
$ npm run test
```

## API Testing

To test the actual endpoint, we can use one of many HTTP client, for the
simplicity purpose, we are going to use `cURL` to test the endpoint, so make
sure you have `cURL` installed on your computer.

In order to run some tests, first run the app by running...

```
$ npm start
```

Or refers to `README.md` file in the root directory of this project for
different ways to run the app.

Once the app is running, it will listen on port `3000`.

Then we can perform a test with following instructions...

### 1. Make sure the game is up and running properly

```
$ curl localhost:3000
```

This should give the 200 status code, with current time in the response.

### 2. Reset current game status, to make sure it properly connected to the database

```
$ curl -X POST localhost:3000/api/reset
```

This should give the 200 status code, with a message indicate the action is
successfully performed.

### 3. Get current game status, to make sure it properly reset the game

```
$ curl localhost:3000/api
```

This should give the 200 status code, also return a board status full of
oceans in the response.

### 4. Place some ships

```
$ curl -X POST -H "content-type: application/json" localhost:3000/api/ship -d '{"ship_type": "battleship", "position_x": 4, "position_y": 9}'
```

This should give the 200 status code, with a message indicate the specified
ship is has been placed.

### 5. Try early attack, to check that it cannot be attacked when

```
$ curl -X POST -H "content-type: application/json" localhost:3000/api/attack -d '{"position_x": 8, "position_y": 0}'
```

This should give the 403 status code, indicate that the action cannot be
performed due to placement is not yet finished.

### 6. Place same ships but more than limited

Run a command below to place more battleship

```
$ curl -X POST -H "content-type: application/json" localhost:3000/api/ship -d '{"ship_type": "battleship", "position_x": 6, "position_y": 9}'
```

If you have run the command in step 4. before, this should give you a 400
status code, indicate that you cannot place the ship as it reach its limit.

### 7. Place more ships, but at the edge of the board

Run a command below to place more ship

```
$ curl -X POST -H "content-type: application/json" localhost:3000/api/ship -d '{"ship_type": "cruiser", "position_x": 9, "position_y": 9}'
```

This should give the 400 status code, with a message indicate that placing
the ship at the specified position will go over the board.

### 8. Place more ships, but near another ship

Run a command below to place more ship

```
$ curl -X POST -H "content-type: application/json" localhost:3000/api/ship -d '{"ship_type": "cruiser", "position_x": 5, "position_y": 8}'
```

This should give the 400 status code, indicate that placing the ship at the
specified position will be close to the other ship nearby.

### 9. Keep on placing

Keep placing the ship until finished

### 10. Try attack something

Run a command below to attack at the specified target

```
$ curl -X POST -H "content-type: application/json" localhost:3000/api/attack -d '{"position_x": 8, "position_y": 0}'
```

If the target is an ocean, a message indicate that the shot was missed will be
returned.  
If the target is a fleet, a message indicate that the shot was hit at the
specific ship will be returned.

Once all the ship has been sunk, a game over message will show up.
