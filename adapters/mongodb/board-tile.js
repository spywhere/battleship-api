const adapter = require("./index");

module.exports = adapter.connector({
    battleship: {
        getBoardTilesBy: ({
            tileType
        }) => ({
            collection: "board_tile",
            find: {
                tile_type: tileType
            }
        })
    }
});
