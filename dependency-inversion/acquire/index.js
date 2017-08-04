'use strict'

const path = require('path');
const Module = require('module');

const modulesMap = Object.create(null);

function acquire(...ids) {
    const requestDir = ids.pop();

    const resolvedModules = ids.map(id => {
        if (id.startsWith('.') || id.startsWith('/')) {
            id = path.join(requestDir, id);
        }

        return modulesMap[id] || require(id);
    });

    return resolvedModules;
}

function makeGlobal(globalId = 'acquire') {
    global[globalId] = acquire;
}

const is = acquire('./is', __dirname)

function publish(...args) {
    const { length } = args;

    if (length === 2 && is.string(args[0])) {
        // publish the given value against the given id
        const [id, moduleToPublish] = args;
        modulesMap[id] = moduleToPublish;
        return acquire;
    }

    if (length === 1 && is.object(args[0])) {
        // use a Map<String, String> which maps module ids to module paths
        // publishes the modulse that are resolved by using the paths against the given ids
        const [moduleNamePathMap] = args;

        for (const moduleName in moduleNamePathMap) {
            const modulePathOrModule = moduleNamePathMap[moduleName]

            if (is.object(modulePathOrModule)) {
                publish(moduleName, modulePathOrModule);
            } else {
                publish(moduleName, acquire(modulePathOrModule, __dirname));
            }

        }

        return acquire;
    }

    throw new Error('this code sucks');
}

function unpublishAll() {
    modulesMap = Object.create(null);
}

function unpublish(...ids) {
    ids.forEach(id => delete modulesMap[id]);
}

module.exports = Object.assign(acquire, {
    publish,
    unpublish,
    unpublishAll,
    makeGlobal,
    cache: modulesMap
});