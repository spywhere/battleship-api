function setupAdapters(adapterList) {
    return adapterList.map(
        // eslint-disable-next-line global-require
        (adapterPath) => require(`../${ adapterPath }`)
    ).reduce((previous, current) => ({ ...previous, ...current }), {});
}

class Controller {
    constructor(delegate) {
        this.delegate = delegate;
    }

    async perform({
        request,
        adapters
    }) {
        // Perform delegate
        return this.delegate.perform({
            adapters: adapters || setupAdapters(
                this.delegate.adapters || []
            ),
            request
        });
    }
}

module.exports = Controller;
