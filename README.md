# BattleShip API

## Remarks
For simplicity purpose, the following points are assumed...

- A connection to another system are made as simple as possible, that is no connection handling, no error handling built-in for connection
- All game limitations are checked by the code, rather by design
- Fleet definition are defined by the code, rather by configurations
- No data migration are considered, if the game rules are changed
- Previous game result / status is not saved when reset

## Setup

### Recommended
The easiest and fastest way to get the game up and running is by using Docker.
Make sure Docker and Docker compose has been installed on your computer, then
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
