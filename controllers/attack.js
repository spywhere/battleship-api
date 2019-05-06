const errors = require("../common/errors");
const gameOptions = require("../game");

module.exports = {
    adapters: [
        "board-tile",
        "battle-log"
    ],
    perform: async({ request, adapters }) => {
        const shipLefts = Object.keys(gameOptions.fleets).map(
            (shipType) => ({
                [shipType]: gameOptions.fleets[shipType].limit
            })
        ).reduce((previous, current) => ({
            ...previous,
            ...current
        }), {});

        const [ headTiles, attackLogs ] = await Promise.all([
            adapters.getBoardTilesBy({
                isShipHead: true
            }),
            adapters.getBattleLogsBy({
                action: "attack"
            })
        ]);

        // Calculate remaining ships to be placed
        for (const tile of headTiles) {
            shipLefts[tile.tile_type] -= 1;
        }

        // If there are some ships needed to be place, reject the request
        if (Object.keys(shipLefts).reduce(
            (sum, key) => sum + shipLefts[key], 0
        ) > 0) {
            throw new errors.HTTPError(
                "Defender did not finish their placement yet.",
                403
            );
        }

        const shotsFired = attackLogs.length;
        const missedShots = attackLogs.reduce(
            (sum, log) => sum + (
                log.tile_type === gameOptions.ocean ? 1 : 0
            ),
            0
        );

        const remainingShips = headTiles.reduce(
            (sum, tile) => sum + (tile.status === "placed" ? 1 : 0),
            0
        );

        if (remainingShips <= 0) {
            return {
                body: {
                    status: "Game over",
                    shots_fired: shotsFired,
                    missed_shots: missedShots
                }
            };
        }

        const {
            position_x: positionX,
            position_y: positionY
        } = request.body;

        // Data validations
        if (
            typeof(positionX) !== "number" ||
            positionX < 0 ||
            positionX >= gameOptions.board.width
        ) {
            throw new errors.HTTPError(
                `Target position X must be a number between 0 and ${
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
                `Target position Y must be a number between 0 and ${
                    gameOptions.board.height - 1
                }.`,
                400
            );
        }

        // Find target tile
        const targetTile = await adapters.getBoardTileBy({
            positionX,
            positionY
        });

        const existingShot = !targetTile && attackLogs.find((log) => (
            log.position_x === positionX &&
            log.position_y === positionY &&
            log.tile_type === gameOptions.ocean
        ));

        if (!targetTile && !existingShot) {
            await adapters.insertBattleLog({
                tileType: gameOptions.ocean,
                positionX,
                positionY,
                action: "attack"
            });
            return {
                body: {
                    status: "Miss",
                    shots_fired: shotsFired + 1,
                    missed_shots: missedShots + 1
                }
            };
        }

        if (existingShot || targetTile.status === "attacked") {
            throw new errors.HTTPError("Target has already attacked.", 400);
        }

        // Destroy all tiles with the same ship ID by update the status
        await Promise.all([
            adapters.updateBoardTilesBy({
                shipID: targetTile.ship_id
            }, {
                status: "attacked"
            }),
            adapters.insertBattleLog({
                tileType: targetTile.tile_type,
                positionX,
                positionY,
                action: "attack"
            })
        ]);

        return {
            body: {
                status: `You just sank the ${ targetTile.tile_type }`,
                shots_fired: shotsFired + 1,
                missed_shots: missedShots
            }
        };
    }
};
