class Adapter {
    constructor(setup) {
        this.setup = setup;
    }

    static connector(setup) {
        return () => new this(setup);
    }

    // Expose all operations for that adapter
    expose(action) {
        const operations = {};

        for (const datasourceName of Object.keys(this.setup)) {
            const datasource = this.setup[datasourceName];

            for (const operationName of Object.keys(datasource)) {
                const operation = datasource[operationName];

                const output = action({
                    self: this,
                    setup: this.setup,
                    datasourceName, datasource,
                    operationName, operation
                });

                if (output) {
                    operations[operationName] = output;
                }
            }
        }

        return operations;
    }

    // Export adapter's operations for particular resources
    export(resources) {
        this.resources = resources;
        return this.expose(
            ({
                self, datasourceName, operation
            }) => async(...parameters) => self.execute(
                datasourceName,
                operation(...parameters)
            )
        );
    }
}

module.exports = Adapter;
