const mongo = require("../lib/mongo");

async function insertBattleLog({
    tileType, positionX, positionY, action
}) {
    return mongo.collection("battle_log").updateOne({
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
    });
}

async function getBattleLogsBy(
    { action } = {}
) {
    return mongo.collection("battle_log").find({ action });
}

async function dropBattleLog() {
    return mongo.collection("battle_log").drop();
}

module.exports = {
    insertBattleLog,
    getBattleLogsBy,
    dropBattleLog
};
