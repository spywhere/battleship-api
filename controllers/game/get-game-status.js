module.exports = {
    adapters: [
        "mongodb/board-tile"
    ],
    perform: async({ adapters, config }) => {
        const gameOptions = config.for("game");

        const tiles = await adapters.getBoardTilesBy({});

        // Fill board with ocean
        const board = new Array(
            gameOptions.board.height
        ).fill(1).map(() => new Array(
            gameOptions.board.width
        ).fill(1).map(() => ({
            type: "ocean"
        })));

        // Replace tiles with non-ocean tiles
        for (const tile of tiles) {
            board[tile.position_y][tile.position_x] = {
                type: tile.tile_type,
                status: tile.status
            };
        }

        return {
            body: {
                board
            }
        };
    }
};
