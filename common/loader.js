const fs = require("fs");
const path = require("path");

const moduleExists = (modulePath) => fs.existsSync(
    path.join(__dirname, `${ modulePath }.js`)
);

const defaultControllerPath = "/controllers";
const defaultPrefixes = ["../"];

function getRequirePath(directory, modulePath, prefixes) {
    const prefixPaths = prefixes || [...defaultPrefixes];

    if (prefixPaths.length === 0) {
        return undefined;
    }

    const requirePath = path.join(prefixPaths.pop(), directory, modulePath);

    if (!moduleExists(requirePath)) {
        return getRequirePath(directory, modulePath, prefixPaths);
    }

    return requirePath;
}

function getControllerDelegate(delegatePath) {
    const controllerPath = getRequirePath(defaultControllerPath, delegatePath);

    if (!controllerPath) {
        throw new Error(
            `Delegate "${ delegatePath }" is not found.`
        );
    }

    // eslint-disable-next-line global-require
    return require(controllerPath);
}

module.exports.getRequirePath = getRequirePath;
module.exports.getControllerDelegate = getControllerDelegate;
