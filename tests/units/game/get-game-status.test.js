/* global expect */
const Controller = require("../../../common/controller");
const delegate = require("../../../controllers/game/get-game-status");

const controller = Controller.mock(delegate);

describe("Game status", () => {
    it("should return ocean tiles if there is no placement", async() => {
        const response = await controller.perform({
            adapters: {
                getBoardTilesBy: async() => []
            }
        });

        expect(response).toMatchObject({
            body: {
                board: new Array(10).fill(1).map(
                    () => new Array(10).fill(1).map(
                        () => ({
                            type: "ocean"
                        })
                    )
                )
            }
        });
    });

    it("should return actual game status if there are some tiles", async() => {
        const response = await controller.perform({
            adapters: {
                getBoardTilesBy: async() => [{
                    position_x: 0,
                    position_y: 0,
                    tile_type: "submarine",
                    status: "placed"
                }, {
                    position_x: 5,
                    position_y: 5,
                    tile_type: "destroyer",
                    status: "destroyed"
                }]
            }
        });

        expect(response).toMatchObject({
            body: {
                board: new Array(10).fill(1).map(
                    (row, y) => new Array(10).fill(1).map(
                        (col, x) => ((
                            x === 0 && y === 0
                        ) ? {
                                type: "submarine",
                                status: "placed"
                            } : (x === 5 && y === 5) ? {
                                type: "destroyer",
                                status: "destroyed"
                            } : {
                                type: "ocean"
                            }
                        )
                    )
                )
            }
        });
    });
});
