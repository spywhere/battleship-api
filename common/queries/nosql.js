class Query {
    constructor(queries) {
        this.queries = queries;
        this.operations = [];
    }

    skip(value) {
        this.operations.push({
            name: "skip",
            values: [value]
        });

        return this;
    }

    limit(value) {
        this.operations.push({
            name: "limit",
            values: [value]
        });

        return this;
    }

    sort(keyOrList, direction) {
        this.operations.push({
            name: "sort",
            values: [ keyOrList, direction ]
        });

        return this;
    }
}

module.exports = (...queries) => new Query(queries);
module.exports.Query = Query;
