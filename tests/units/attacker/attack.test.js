/* global expect, jest */
const Controller = require("../../../common/controller");
const delegate = require("../../../controllers/attacker/attack");

const controller = Controller.mock(delegate);

const shipLookup = {
    b: "battleship",
    c: "cruiser",
    d: "destroyer",
    s: "submarine",
    o: "ocean"
};

const gameBoard = [
    "  Dd      ",
    "          ",
    "Ccc   Ccc ",
    "          ",
    " S   B   S",
    "     b    ",
    " S   b   S",
    "     b    ",
    " Dd       ",
    "        Dd"
];

const battleLogs = {
    battle1: [
        "   d      ",
        "      o   ",
        "  c    c  ",
        "          ",
        " s       s",
        "     b    ",
        " s       s",
        "    o     ",
        "  d       ",
        "        d "
    ]
};

const mockBoardTiles = ({ onlyHead, status }) => gameBoard.reduce(
    (list, row, rowIndex) => [
        ...list,
        ...(
            row.split("").filter(
                (shipType) => !onlyHead || /[A-Z]/g.test(shipType)
            ).map((shipType, colIndex) => ({
                tile_type: shipLookup[shipType.toLowerCase()],
                position_x: colIndex,
                position_y: rowIndex,
                status
            }))
        )
    ],
    []
);

const mockBattleLogs = (
    battle, { includeMiss, action }
) => battleLogs[battle].reduce(
    (list, row, rowIndex) => [
        ...list,
        ...(
            row.split("").filter(
                (shipType) => shipType !== " " && (
                    includeMiss || shipType !== "o"
                )
            ).map((shipType, colIndex) => ({
                tile_type: shipLookup[shipType.toLowerCase()],
                position_x: colIndex,
                position_y: rowIndex,
                action
            }))
        )
    ],
    []
);

const getBoardTileBy = ({
    status, shipID
}) => async({ positionX, positionY }) => ({
    ship_id: shipID,
    tile_type: shipLookup[gameBoard[positionY][positionX].toLowerCase()],
    position_x: positionX,
    position_y: positionY,
    status
});

describe("Ship attack", () => {
    it("should reject an invalid request (position x)", async() => {
        const adapters = {
            getBoardTilesBy: async() => mockBoardTiles({
                onlyHead: true,
                status: "placed"
            }),
            getBattleLogsBy: async() => []
        };

        try {
            await controller.perform({
                adapters,
                request: {
                    body: {
                        position_x: -1,
                        position_y: 0
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Target position X must be a number between 0 and 9."
            });
        }
    });

    it("should reject an invalid request (position y)", async() => {
        const adapters = {
            getBoardTilesBy: async() => mockBoardTiles({
                onlyHead: true,
                status: "placed"
            }),
            getBattleLogsBy: async() => []
        };

        try {
            await controller.perform({
                adapters,
                request: {
                    body: {
                        position_x: 1,
                        position_y: 10
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Target position Y must be a number between 0 and 9."
            });
        }
    });

    it("should reject if defender did not finish their placement", async() => {
        const adapters = {
            getBoardTilesBy: async() => [],
            getBattleLogsBy: async() => []
        };

        try {
            await controller.perform({
                adapters,
                request: {
                    body: {
                        position_x: 1,
                        position_y: 1
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 403,
                message: "Defender did not finish their placement yet."
            });
        }
    });

    it("should show game over when all ship has been sunk", async() => {
        const adapters = {
            getBoardTilesBy: async() => mockBoardTiles({
                onlyHead: true,
                status: "attacked"
            }),
            getBattleLogsBy: async() => mockBattleLogs("battle1", {
                includeMiss: true,
                action: "attack"
            })
        };

        const response = await controller.perform({
            adapters,
            request: {
                body: {
                    position_x: 9,
                    position_y: 9
                }
            }
        });

        expect(response).toMatchObject({
            body: {
                status: "Game over",
                shots_fired: 12,
                missed_shots: 2
            }
        });
    });

    it("should miss a shot when attack an ocean", async() => {
        const adapters = {
            getBoardTilesBy: async() => mockBoardTiles({
                onlyHead: true,
                status: "placed"
            }),
            getBattleLogsBy: async() => mockBattleLogs("battle1", {
                includeMiss: false,
                action: "attack"
            }).slice(0, 2),
            getBoardTileBy: async() => null,
            insertBattleLog: jest.fn(async() => undefined)
        };

        const response = await controller.perform({
            adapters,
            request: {
                body: {
                    position_x: 5,
                    position_y: 3
                }
            }
        });

        expect(response).toMatchObject({
            body: {
                status: "Miss",
                shots_fired: 3,
                missed_shots: 1
            }
        });

        expect(adapters.insertBattleLog).toBeCalled();
    });

    it("should reject if target has been attacked (ocean)", async() => {
        const adapters = {
            getBoardTilesBy: async() => mockBoardTiles({
                onlyHead: true,
                status: "placed"
            }),
            getBattleLogsBy: async() => mockBattleLogs("battle1", {
                includeMiss: true,
                action: "attack"
            }).slice(0, 5),
            getBoardTileBy: async() => null,
            insertBattleLog: jest.fn(async() => undefined)
        };

        try {
            await controller.perform({
                adapters,
                request: {
                    body: {
                        position_x: 6,
                        position_y: 1
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Target has already attacked."
            });

            expect(adapters.insertBattleLog).not.toBeCalled();
        }
    });

    it("should reject if target has been attacked (fleet)", async() => {
        const adapters = {
            getBoardTilesBy: async() => mockBoardTiles({
                onlyHead: true,
                status: "placed"
            }),
            getBattleLogsBy: async() => mockBattleLogs("battle1", {
                includeMiss: true,
                action: "attack"
            }).slice(0, 5),
            getBoardTileBy: getBoardTileBy({ status: "attacked" }),
            insertBattleLog: jest.fn(async() => undefined)
        };

        try {
            await controller.perform({
                adapters,
                request: {
                    body: {
                        position_x: 3,
                        position_y: 2
                    }
                }
            });
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Target has already attacked."
            });

            expect(adapters.insertBattleLog).not.toBeCalled();
        }
    });

    it("should sank an entire ship when hit", async() => {
        let target;

        const adapters = {
            getBoardTilesBy: async() => mockBoardTiles({
                onlyHead: true,
                status: "placed"
            }),
            getBattleLogsBy: async() => mockBattleLogs("battle1", {
                includeMiss: true,
                action: "attack"
            }).slice(0, 5),
            getBoardTileBy: getBoardTileBy({
                status: "placed", shipID: "9,8"
            }),
            updateBoardTilesBy: jest.fn(async({ shipID }, { status }) => {
                target = {
                    [shipID]: status
                };
            }),
            insertBattleLog: jest.fn(async() => undefined)
        };

        const response = await controller.perform({
            adapters,
            request: {
                body: {
                    position_x: 9,
                    position_y: 9
                }
            }
        });

        expect(response).toMatchObject({
            body: {
                status: "You just sank the destroyer",
                shots_fired: 6,
                missed_shots: 1
            }
        });

        expect(adapters.updateBoardTilesBy).toBeCalled();
        expect(adapters.insertBattleLog).toBeCalled();

        expect(target).toMatchObject({
            "9,8": "attacked"
        });
    });
});
