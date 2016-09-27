'use strict';

function wrapInPromise(connectionPromise, connectionCache, collectionName, dataProviderFn) {
    return function promisified(...args) {
        if ('collection' in connectionCache) {
            return dataProviderFn.apply(null, [connectionCache.collection, ...args]);
        }

        return connectionPromise.then(function (connection) {
            connectionCache.connection = connection;
            connectionCache.collection = connection.collection(collectionName);
        }).then(_ => dataProviderFn.apply(null, [connectionCache.collection, ...args]));
    }
};

module.exports = {
    wrapInPromise
}