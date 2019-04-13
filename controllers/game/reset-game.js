module.exports = {
    adapters: [
        "mongodb/board-tile"
    ],
    perform: async({ adapters }) => {
        await adapters.dropBoardTile();

        return {
            body: {
                status: "Reset successful"
            }
        };
    }
};
