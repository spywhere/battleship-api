module.exports = {
    adapters: [
        "mongodb/board-tile",
        "mongodb/battle-log"
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
