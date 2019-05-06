/* global expect, jest */
const Controller = require("../common/controller");
const delegate = require("../controllers/reset-game");

const controller = new Controller(delegate);

describe("Game reset", () => {
    it("should try to remove all board tiles", async() => {
        const adapters = {
            dropBoardTile: jest.fn(async() => undefined),
            dropBattleLog: jest.fn(async() => undefined)
        };

        const response = await controller.perform({
            adapters
        });

        expect(response).toMatchObject({
            body: {
                status: "Reset successful"
            }
        });

        expect(adapters.dropBoardTile).toBeCalled();
        expect(adapters.dropBattleLog).toBeCalled();
    });
});
