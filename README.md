# BattleShip API

## This is a KISS branch
In this branch, we will **K**eep **I**t **S**tupid **S**imple for the game.
That said, there will be minimal design patterns and scalability considerations involved.

Some of the things that has been removed to KISS are...

- Flexible error handling (will now use a basic error handling)
- Some data isolation layers
- A structured routing
- Logging (will just directly print out into the console)
- Some security considerations (for example: stack traces)

We will still keep Docker and process management support to help with easy
setup and get the app running in no time

## Remarks
For simplicity purpose, the following points are assumed...

- A connection to another system are made as simple as possible, that is no connection handling, no error handling built-in for connection
- All game limitations are checked by the code, rather by design
- No data migration are considered, if the game rules are changed
- Previous game result / status is not saved when reset
- A visual representation of the game is solely for easy to read, no test was created for the feature

## Setup

### Recommended
The easiest and fastest way to get the game up and running is by using Docker.
Make sure Docker and Docker Compose has been installed on your computer, then
run the following command...

```
$ docker-compose up
```

Game will start on port 3000 with MongoDB running on port 27017

### Manual Setup
To get the game running, you would need to install the following software...

- Node.js (with `npm`)
- MongoDB

Before running the game, you would need to install all the dependencies by
running the following command in the project directory...

```
$ npm install
```

To run the game, simply run...

```
$ npm start
```

Game will start on port 3000 by default with connection to MongoDB on port 27017

## Tests
To run all unit tests, simply run...

```
$ npm test
```

For more details on the tests, refers to testing guide provided below

## Documentations

- `developers/design.md` Data Structure Design
- `developers/architecture.md` Application Architecture
- `developers/testing.md` Guide to Application Testing
