const mongodb = require("mongodb");

const connectionUrl = process.env.MONGODB_HOST || "mongodb://127.0.0.1:27017";
const databaseName = "battleship";

// Cache connection
let client;

function normalizeObject(object) {
    if (
        typeof(object) !== "object" ||
        Array.isArray(object) ||
        object === null
    ) {
        return object;
    }

    return Object.keys(object).reduce((newObject, key) => {
        if (object[key] === undefined) {
            return newObject;
        }

        return {
            ...newObject,
            [key]: object[key]
        };
    }, {});
}

module.exports.collection = (collectionName) => {
    async function getDatabase() {
        if (client) {
            return client.db(databaseName);
        }

        client = await mongodb.connect(
            connectionUrl,
            {
                useNewUrlParser: true
            }
        );

        return client.db(databaseName);
    }

    async function getCollection() {
        const database = await getDatabase();
        const collection = database.collection(collectionName);
        const readable = await database.listCollections({
            name: collectionName
        }).hasNext();

        collection.readable = readable;

        return collection;
    }

    async function buildOperation({
        method,
        defaultValue,
        defaultWhenUnreadable,
        args
    }) {
        const collection = await getCollection();
        if (
            !collection ||
            (defaultWhenUnreadable && !collection.readable)
        ) {
            return defaultValue;
        }

        return collection[method](...args);
    }

    return {
        find: async(filter) => buildOperation({
            method: "find",
            defaultValue: [],
            args: [normalizeObject(filter)]
        }),
        findOne: async(filter) => buildOperation({
            method: "findOne",
            args: [normalizeObject(filter)]
        }),
        insertMany: async(documents) => buildOperation({
            method: "insertMany",
            args: [normalizeObject(documents)]
        }),
        updateOne: async(filter, updateDocument, options) => buildOperation({
            method: "updateOne",
            args: [ normalizeObject(filter), updateDocument, options ]
        }),
        updateMany: async(filter, updateDocument, options) => buildOperation({
            method: "updateMany",
            args: [ normalizeObject(filter), updateDocument, options ]
        }),
        drop: async() => buildOperation({
            method: "drop",
            args: [],
            defaultWhenUnreadable: true
        })
    };
};
