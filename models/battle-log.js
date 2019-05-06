const mongo = require("../lib/mongo");

module.exports = {
    insertBattleLog: async({
        tileType, positionX, positionY, action
    }) => mongo.collection("battle_log").updateOne({
        tile_type: tileType,
        position_x: positionX,
        position_y: positionY,
        action
    }, {
        $set: {
            tile_type: tileType,
            position_x: positionX,
            position_y: positionY,
            action
        }
    }, {
        upsert: true
    }),
    getBattleLogsBy: async(
        { action } = {}
    ) => mongo.collection("battle_log").find({ action }),
    dropBattleLog: async() => mongo.collection("battle_log").drop()
};
