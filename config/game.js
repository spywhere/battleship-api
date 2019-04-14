module.exports = {
    board: {
        width: +(process.env.GAME_GRID_WIDTH) || 10,
        height: +(process.env.GAME_GRID_HEIGHT) || 10
    },
    ocean: "ocean",
    fleets: {
        battleship: {
            size: +(process.env.FLEET_BATTLESHIP_SIZE) || 4,
            limit: +(process.env.FLEET_BATTLESHIP_LIMIT) || 1
        },
        cruiser: {
            size: +(process.env.FLEET_CRUISER_SIZE) || 3,
            limit: +(process.env.FLEET_CRUISER_LIMIT) || 2
        },
        destroyer: {
            size: +(process.env.FLEET_DESTROYER_SIZE) || 2,
            limit: +(process.env.FLEET_DESTROYER_LIMIT) || 3
        },
        submarine: {
            size: +(process.env.FLEET_SUBMARINE_SIZE) || 1,
            limit: +(process.env.FLEET_SUBMARINE_LIMIT) || 4
        }
    },

    // Configuration for testing environment
    test: {
        board: {
            width: 10,
            height: 10
        },
        ocean: "ocean",
        fleets: {
            battleship: {
                size: 4,
                limit: 1
            },
            cruiser: {
                size: 3,
                limit: 2
            },
            destroyer: {
                size: 2,
                limit: 3
            },
            submarine: {
                size: 1,
                limit: 4
            }
        }
    }
};
