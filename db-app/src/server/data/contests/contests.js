'use strict';

module.exports = function (connectionPromise, collectionName, wrapInPromise) {

    // cache connection and collection
    const cache = {};

    const promisifyWithContext = wrapInPromise.bind(null, connectionPromise, cache, collectionName);

    const dataProviderFunctions = [

        function page(collection, options) {
            return collection
                .find(options.filter || {})
                .sort(options.sort || { _id: 1 })
                .skip((options.pageSize || 10) * options.pageNumber)
                .limit(options.pageSize)
                .project(options.project || {})
                .toArray();
        },

        function insert(collection, records) {
            return collection.insert(records);
        },

        function first(collection, options) {
            return collection.findOne(options);
        },

        function updateOne(collection, options) {
            return collection.findOneAndUpdate(options.filter, options.updates);
        }

    ];

    const exports = {};

    dataProviderFunctions.forEach(fn => exports[fn.name] = promisifyWithContext(fn));

    return exports;
}