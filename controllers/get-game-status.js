const gameOptions = require("../game");

function replaceAt(string, index, replacement) {
    if (!replacement) {
        return string;
    }

    return `${
        string.substr(0, index)
    }${
        replacement
    }${
        string.substr(index + 1)
    }`;
}

module.exports = {
    adapters: [
        "models/board-tile"
    ],
    perform: async({ adapters }) => {
        const tiles = await adapters.getBoardTilesBy();

        const shipLefts = Object.keys(gameOptions.fleets).map(
            (shipType) => ({
                [shipType]: gameOptions.fleets[shipType].limit
            })
        ).reduce((previous, current) => ({
            ...previous,
            ...current
        }), {});

        // Fill board with ocean
        const board = new Array(
            gameOptions.board.height
        ).fill(1).map(() => new Array(
            gameOptions.board.width
        ).fill(1).map(() => ({
            type: gameOptions.ocean,
            status: "placed"
        })));

        const visual = new Array(
            gameOptions.board.height
        ).fill(1).map(() => " ".repeat(gameOptions.board.width));

        // Replace tiles with non-ocean tiles
        for (const tile of tiles) {
            if (tile.is_ship_head) {
                shipLefts[tile.tile_type] -= 1;
            }

            board[tile.position_y][tile.position_x] = {
                type: tile.tile_type,
                status: tile.status
            };

            const [mark] = (
                tile.status === "attacked" ?
                    tile.tile_type.toUpperCase() : tile.tile_type
            );

            visual[tile.position_y] = replaceAt(
                visual[tile.position_y], tile.position_x, mark
            );
        }

        const gameState = Object.keys(shipLefts).reduce(
            (sum, key) => sum + shipLefts[key], 0
        ) > 0 ? "placement" : "attack";

        return {
            body: {
                state: gameState,
                board,
                visual
            }
        };
    }
};
