/* global expect, jest */
const Controller = require("../../../common/controller");
const delegate = require("../../../controllers/defender/place-fleet");

const controller = Controller.mock(delegate);

describe("Fleet placement", () => {
    it("should reject an invalid request (ship type)", async() => {
        try {
            await controller.perform({
                request: {
                    body: {
                        ship_type: "aircraft-carrier",
                        position_x: 0,
                        position_y: 0
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Ship type is not valid, possible values are: battleship, cruiser, destroyer, submarine"
            });
        }
    });

    it("should reject an invalid request (position x)", async() => {
        try {
            await controller.perform({
                request: {
                    body: {
                        ship_type: "submarine",
                        position_x: -1,
                        position_y: 0
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Placement position X must be a number between 0 and 9."
            });
        }
    });

    it("should reject an invalid request (position y)", async() => {
        try {
            await controller.perform({
                request: {
                    body: {
                        ship_type: "submarine",
                        position_x: 1,
                        position_y: 10
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Placement position Y must be a number between 0 and 9."
            });
        }
    });

    it("should reject an invalid request (direction)", async() => {
        try {
            await controller.perform({
                request: {
                    body: {
                        ship_type: "submarine",
                        position_x: 1,
                        position_y: 1,
                        direction: "up"
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Placement direction is not valid, possible values are: horizontal, vertical"
            });
        }
    });

    it("should allow ship placement on the edge", async() => {
        const adapters = {
            getBoardTilesBy: async() => [],
            getBoardTileBy: async() => undefined,
            insertBoardTiles: jest.fn(async() => undefined),
            insertBattleLog: jest.fn(async() => undefined)
        };

        const response = await controller.perform({
            adapters,
            request: {
                body: {
                    ship_type: "submarine",
                    position_x: 9,
                    position_y: 9
                }
            }
        });

        expect(response).toMatchObject({
            body: {
                status: "Placed submarine"
            }
        });

        expect(adapters.insertBoardTiles).toBeCalled();
        expect(adapters.insertBattleLog).toBeCalled();
    });

    it("should place multiple ship tiles (horizontal)", async() => {
        const storage = [];

        const adapters = {
            getBoardTilesBy: async() => [],
            getBoardTileBy: async() => undefined,
            insertBoardTiles: jest.fn(async(tiles) => storage.push(...tiles)),
            insertBattleLog: jest.fn(async() => undefined)
        };

        const response = await controller.perform({
            adapters,
            request: {
                body: {
                    ship_type: "battleship",
                    position_x: 3,
                    position_y: 9,
                    direction: "horizontal"
                }
            }
        });

        expect(response).toMatchObject({
            body: {
                status: "Placed battleship"
            }
        });

        expect(adapters.insertBoardTiles).toBeCalled();
        expect(adapters.insertBattleLog).toBeCalled();

        expect(storage).toMatchObject([{
            isShipHead: true,
            shipID: "3,9",
            tileType: "battleship",
            positionX: 3,
            positionY: 9,
            status: "placed"
        }, {
            isShipHead: false,
            shipID: "3,9",
            tileType: "battleship",
            positionX: 4,
            positionY: 9,
            status: "placed"
        }, {
            isShipHead: false,
            shipID: "3,9",
            tileType: "battleship",
            positionX: 5,
            positionY: 9,
            status: "placed"
        }, {
            isShipHead: false,
            shipID: "3,9",
            tileType: "battleship",
            positionX: 6,
            positionY: 9,
            status: "placed"
        }]);
    });

    it("should place multiple ship tiles (vertical)", async() => {
        const storage = [];

        const adapters = {
            getBoardTilesBy: async() => [],
            getBoardTileBy: async() => undefined,
            insertBoardTiles: jest.fn(async(tiles) => storage.push(...tiles)),
            insertBattleLog: jest.fn(async() => undefined)
        };

        const response = await controller.perform({
            adapters,
            request: {
                body: {
                    ship_type: "battleship",
                    position_x: 0,
                    position_y: 6,
                    direction: "vertical"
                }
            }
        });

        expect(response).toMatchObject({
            body: {
                status: "Placed battleship"
            }
        });

        expect(adapters.insertBoardTiles).toBeCalled();
        expect(adapters.insertBattleLog).toBeCalled();

        expect(storage).toMatchObject([{
            isShipHead: true,
            shipID: "0,6",
            tileType: "battleship",
            positionX: 0,
            positionY: 6,
            status: "placed"
        }, {
            isShipHead: false,
            shipID: "0,6",
            tileType: "battleship",
            positionX: 0,
            positionY: 7,
            status: "placed"
        }, {
            isShipHead: false,
            shipID: "0,6",
            tileType: "battleship",
            positionX: 0,
            positionY: 8,
            status: "placed"
        }, {
            isShipHead: false,
            shipID: "0,6",
            tileType: "battleship",
            positionX: 0,
            positionY: 9,
            status: "placed"
        }]);
    });

    it("should reject if ship limit is reached", async() => {
        const adapters = {
            getBoardTilesBy: async() => [{
                is_ship_head: true,
                ship_id: "0,0",
                tile_type: "submarine",
                position_x: 0,
                position_y: 0,
                status: "placed"
            }, {
                is_ship_head: true,
                ship_id: "0,0",
                tile_type: "submarine",
                position_x: 0,
                position_y: 2,
                status: "placed"
            }, {
                is_ship_head: true,
                ship_id: "0,0",
                tile_type: "submarine",
                position_x: 3,
                position_y: 4,
                status: "placed"
            }, {
                is_ship_head: true,
                ship_id: "0,0",
                tile_type: "submarine",
                position_x: 2,
                position_y: 6,
                status: "placed"
            }]
        };

        try {
            await controller.perform({
                adapters,
                request: {
                    body: {
                        ship_type: "submarine",
                        position_x: 1,
                        position_y: 1
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Maximum submarine placed (limit to 4)."
            });
        }
    });

    it("should reject if ship placement is outside the board", async() => {
        const adapters = {
            getBoardTilesBy: async() => [],
            getBoardTileBy: async() => undefined
        };

        try {
            await controller.perform({
                adapters,
                request: {
                    body: {
                        ship_type: "battleship",
                        position_x: 5,
                        position_y: 8,
                        direction: "vertical"
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Invalid placement, ship will be placed outside the board."
            });
        }
    });

    it("should reject if ship placement is near another ship", async() => {
        const adapters = {
            getBoardTilesBy: async() => [],
            getBoardTileBy: async() => ({
                is_ship_head: true,
                ship_id: "0,0",
                tile_type: "battleship",
                position_x: 0,
                position_y: 0,
                status: "placed"
            })
        };

        try {
            await controller.perform({
                adapters,
                request: {
                    body: {
                        ship_type: "submarine",
                        position_x: 1,
                        position_y: 1
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Invalid placement, battleship is nearby."
            });
        }
    });
});
