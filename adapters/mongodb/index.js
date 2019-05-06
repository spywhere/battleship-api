const Adapter = require("../adapter");
const nosqlQuery = require("../../common/queries/nosql");

const mongodb = require("mongodb");

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

function applyOperations(operations, cursor) {
    for (const operation of operations) {
        cursor[operation.name](...operation.values);
    }

    return cursor.toArray();
}

const transformers = {
    find: applyOperations,
    aggregate: applyOperations
};

class MongoDBAdapter extends Adapter {
    async getDatabase(databaseName) {
        if (client) {
            return client.db(databaseName);
        }

        client = await mongodb.connect(
            process.env.MONGODB_HOST || "mongodb://127.0.0.1:27017",
            {
                useNewUrlParser: true
            }
        );

        return client.db(databaseName);
    }

    async executeQuery(collection, method, ...args) {
        let queries = args;
        let operations = [];

        if (args.length > 0 && args[0] instanceof nosqlQuery.Query) {
            const [query] = args;

            const {
                queries: newQueries,
                operations: newOperations
            } = query;

            queries = newQueries;
            operations = newOperations;
        }

        const result = await collection[method](
            ...queries.map(normalizeObject)
        );

        const transformer = transformers[method];
        if (transformer) {
            return transformer(operations, result);
        }

        return result;
    }

    async execute(datasourceName, parameter) {
        const {
            collection: collectionName
        } = parameter;

        const database = await this.getDatabase(
            datasourceName
        );
        const collection = database.collection(collectionName);
        const readable = await database.listCollections({
            name: collectionName
        }).hasNext();

        const existOperations = readable ? ["drop"] : [];

        const method = [
            "findOne", "find", "aggregate",
            "insert", "insertOne", "insertMany",
            "update", "updateOne", "updateMany",
            "findOneAndUpdate", "findOneAndReplace"
        ].concat(existOperations).find(
            (methodName) => !!parameter[methodName]
        );

        if (!method) {
            return undefined;
        }

        return this.executeQuery(
            collection, method, parameter[method]
        );
    }
}

module.exports = MongoDBAdapter;
