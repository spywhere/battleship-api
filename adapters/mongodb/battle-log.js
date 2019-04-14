const adapter = require("./index");
const nosqlQuery = require("../../common/queries/nosql");

module.exports = adapter.connector({
    battleship: {
        insertBattleLog: ({
            tileType, positionX, positionY, action
        }) => ({
            collection: "battle_log",
            updateOne: nosqlQuery({
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
            })
        }),
        getBattleLogsBy: ({ action } = {}) => ({
            collection: "battle_log",
            find: {
                action
            }
        }),
        dropBattleLog: () => ({
            collection: "battle_log",
            drop: {}
        })
    }
});
