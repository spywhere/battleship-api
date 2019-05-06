const mongo = require("../lib/mongo");

module.exports = {
    insertBoardTiles: async(
        tiles
    ) => mongo.collection("board_tile").insertMany(tiles.map(({
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
    }))),
    getBoardTilesBy: async(
        { isShipHead, tileType } = {}
    ) => mongo.collection("board_tile").find({
        is_ship_head: isShipHead,
        tile_type: tileType
    }),
    getBoardTileBy: async({
        tileType,
        positionX,
        positionY,
        status
    }) => mongo.collection("board_tile").findOne({
        tile_type: tileType,
        position_x: positionX,
        position_y: positionY,
        status
    }),
    updateBoardTilesBy: async(
        { shipID } = {},
        { status }
    ) => mongo.collection("board_tile").updateMany({
        ship_id: shipID
    }, {
        $set: {
            status
        }
    }),
    dropBoardTile: async() => mongo.collection("board_tile").drop()
};
