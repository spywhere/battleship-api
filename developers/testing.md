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
$ curl localhost:3000/api/reset
```

This should give the 200 status code, with a message indicate the action is
successfully performed.

### 3. Get current game status, to make sure it properly reset the game

```
$ curl localhost:3000/api
```

This should give the 200 status code, also return a board status full of
oceans in the response.
