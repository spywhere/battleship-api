const caches = {};

module.exports = (path, defaultConfig) => {
    let config;

    try {
        config = caches[path];
        if (!config) {
            // eslint-disable-next-line global-require
            config = require(`../config/${ path }`);
            caches[path] = config;
        }
    } catch (error) {
        if (!defaultConfig) {
            throw error;
        }
        config = defaultConfig;
    }

    const environment = process.env.NODE_ENV;

    if (environment && config[environment]) {
        config = { ...config, ...config[environment] };
    }

    return config;
};
