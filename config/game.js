module.exports = {
    board: {
        width: +(process.env.GAME_GRID_WIDTH) || 10,
        height: +(process.env.GAME_GRID_HEIGHT) || 10
    },
    "fleet-limit": {
        battleship: +(process.env.FLEET_BATTLESHIP_LIMIT) || 1,
        cruiser: +(process.env.FLEET_CRUISER_LIMIT) || 2,
        destroyer: +(process.env.FLEET_DESTROYER_LIMIT) || 3,
        submarine: +(process.env.FLEET_SUBMARINE_LIMIT) || 4
    },

    // Configuration for testing environment
    test: {
        board: {
            width: 10,
            height: 10
        },
        "fleet-limit": {
            battleship: 1,
            cruiser: 2,
            destroyer: 3,
            submarine: 4
        }
    }
};
