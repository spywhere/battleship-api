const config = require("../common/config");
const errors = require("../common/errors");

module.exports = {
    adapters: [
        "mongodb/board-tile",
        "mongodb/battle-log"
    ],
    perform: async({ request, adapters }) => {
        const gameOptions = config("game");

        const {
            ship_type: shipType,
            position_x: positionX,
            position_y: positionY,
            direction = "horizontal"
        } = request.body;

        // Data validations
        const possibleShipTypes = Object.keys(gameOptions.fleets);

        if (!possibleShipTypes.includes(shipType)) {
            throw new errors.HTTPError(
                `Ship type is not valid, possible values are: ${
                    possibleShipTypes.join(", ")
                }`,
                400
            );
        }

        if (
            typeof(positionX) !== "number" ||
            positionX < 0 ||
            positionX >= gameOptions.board.width
        ) {
            throw new errors.HTTPError(
                `Placement position X must be a number between 0 and ${
                    gameOptions.board.width - 1
                }.`,
                400
            );
        }

        if (
            typeof(positionY) !== "number" ||
            positionY < 0 ||
            positionY >= gameOptions.board.height
        ) {
            throw new errors.HTTPError(
                `Placement position Y must be a number between 0 and ${
                    gameOptions.board.height - 1
                }.`,
                400
            );
        }

        const possibleDirections = [
            "horizontal",
            "vertical"
        ];

        if (!possibleDirections.includes(direction)) {
            throw new errors.HTTPError(
                `Placement direction is not valid, possible values are: ${
                    possibleDirections.join(", ")
                }`,
                400
            );
        }

        const {
            size: shipSize = 0,
            limit: shipLimit = 0
        } = gameOptions.fleets[shipType];

        // Check if we have reached a ship limit
        const shipHeadTiles = await adapters.getBoardTilesBy({
            isShipHead: true,
            tileType: shipType
        });

        if (shipLimit <= shipHeadTiles.length) {
            throw new errors.HTTPError(`Maximum ${
                shipType
            } placed (limit to ${
                shipLimit
            }).`, 400);
        }

        // Ship shape
        //
        //   minX    maxX
        //    v       v
        //    <======>    < minY
        //                < maxY
        //
        const minX = positionX;
        const minY = positionY;
        let maxX = positionX;
        let maxY = positionY;

        if (direction === "vertical") {
            maxX += 1;
            maxY += shipSize;
        } else {
            maxX += shipSize;
            maxY += 1;
        }

        if (
            maxX > gameOptions.board.width ||
            maxY > gameOptions.board.height
        ) {
            throw new errors.HTTPError(
                "Invalid placement, ship will be placed outside the board.",
                400
            );
        }

        // Find ship perimeters for a non-free tile
        const nonFreeTile = await adapters.getBoardTileBy({
            tileType: {
                $ne: gameOptions.ocean
            },
            positionX: {
                $gte: minX - 1,
                $lt: maxX + 1
            },
            positionY: {
                $gte: minY - 1,
                $lt: maxY + 1
            }
        });

        if (nonFreeTile) {
            throw new errors.HTTPError(`Invalid placement, ${
                nonFreeTile.tile_type
            } is nearby.`, 400);
        }

        // Create ship tiles
        const shipTiles = new Array(maxY - minY).fill(1).map(
            (row, y) => new Array(maxX - minX).fill(1).map(
                (col, x) => ({
                    isShipHead: x === 0 && y === 0,
                    shipID: `${ positionX },${ positionY }`,
                    tileType: shipType,
                    positionX: minX + x,
                    positionY: minY + y,
                    status: "placed"
                })
            )
        ).reduce((previous, current) => [
            ...previous, ...current
        ], []);

        await Promise.all([
            adapters.insertBoardTiles(shipTiles),
            adapters.insertBattleLog({
                tileType: shipType,
                positionX,
                positionY,
                action: "place"
            })
        ]);

        return {
            body: {
                status: `Placed ${ shipType }`
            }
        };
    }
};
