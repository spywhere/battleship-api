module.exports = {
    adapters: [
        "models/board-tile",
        "models/battle-log"
    ],
    perform: async({ adapters }) => {
        await Promise.all([
            adapters.dropBoardTile(),
            adapters.dropBattleLog()
        ]);

        return {
            body: {
                status: "Reset successful"
            }
        };
    }
};
