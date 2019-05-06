const mongo = require("../lib/mongo");

async function insertBoardTiles(tiles) {
    return mongo.collection("board_tile").insertMany(tiles.map(({
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
    })));
}

async function getBoardTilesBy(
    { isShipHead, tileType } = {}
) {
    return (await mongo.collection("board_tile").find({
        is_ship_head: isShipHead,
        tile_type: tileType
    })).toArray();
}

async function getBoardTileBy({
    tileType,
    positionX,
    positionY,
    status
}) {
    return mongo.collection("board_tile").findOne({
        tile_type: tileType,
        position_x: positionX,
        position_y: positionY,
        status
    });
}

async function updateBoardTilesBy(
    { shipID } = {},
    { status }
) {
    return mongo.collection("board_tile").updateMany({
        ship_id: shipID
    }, {
        $set: {
            status
        }
    });
}

async function dropBoardTile() {
    return mongo.collection("board_tile").drop();
}

module.exports = {
    insertBoardTiles,
    getBoardTilesBy,
    getBoardTileBy,
    updateBoardTilesBy,
    dropBoardTile
};
