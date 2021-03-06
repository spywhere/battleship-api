const adapter = require("./index");
const nosqlQuery = require("../../common/queries/nosql");

module.exports = adapter.connector({
    battleship: {
        insertBoardTiles: (tiles) => ({
            collection: "board_tile",
            insertMany: tiles.map(({
                isShipHead,
                shipID,
                tileType,
                positionX,
                positionY,
                status
            }) => ({
                is_ship_head: isShipHead,
                ship_id: shipID,
                tile_type: tileType,
                position_x: positionX,
                position_y: positionY,
                status
            }))
        }),
        getBoardTilesBy: ({ isShipHead, tileType } = {}) => ({
            collection: "board_tile",
            find: {
                is_ship_head: isShipHead,
                tile_type: tileType
            }
        }),
        getBoardTileBy: ({
            tileType,
            positionX,
            positionY,
            status
        }) => ({
            collection: "board_tile",
            findOne: {
                tile_type: tileType,
                position_x: positionX,
                position_y: positionY,
                status
            }
        }),
        updateBoardTilesBy: ({ shipID } = {}, { status }) => ({
            collection: "board_tile",
            updateMany: nosqlQuery({
                ship_id: shipID
            }, {
                $set: {
                    status
                }
            })
        }),
        dropBoardTile: () => ({
            collection: "board_tile",
            drop: {}
        })
    }
});
