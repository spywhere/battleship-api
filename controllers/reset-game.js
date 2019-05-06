module.exports = {
    adapters: [
        "board-tile",
        "battle-log"
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
