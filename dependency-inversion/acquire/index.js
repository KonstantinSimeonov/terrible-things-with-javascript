'use strict'

/**
 * acquire modules are stored here
 */
let modulesMap = Object.create(null)

/**
 * Resolves and returns the modules with the given ids. If a module cannot be resolved
 * from the acquire modules map, acquire fallbacks to require.
 * @param {Array.<string>} ids - ids of the modules to be returned
 * @returns {Array|any} - if only one module is requested, then the resolved value is returned.
 * In case multiple modules are requested, returns an array of the resolved modules.
 */
const acquire = (...ids) => {
    const resolvedModules = ids.map(id => modulesMap[id] || require(id))

    return (resolvedModules.length === 1) ? resolvedModules[0] : resolvedModules
}

/**
 * @param {string} globalId - identifier under which the 'acquire' function will be registered globally
 */
const makeGlobal = (globalId = 'acquire') => global[globalId] = acquire

const is = acquire('./is')

const publish = (...args) => {
    const { length } = args

    if (length === 1 && is.string(args[0])) {
        // publish module by id, like 'path', 'fs', 'http', 'express'
        const [id] = args
        modulesMap[id] = acquire(id)
        return acquire
    }

    if (length === 2 && is.string(args[0])) {
        // publish the given value against the given id
        const [id, moduleToPublish] = args
        modulesMap[id] = moduleToPublish
        return acquire
    }

    if (length === 1 && is.object(args[0])) {
        // use a Map<String, String> which maps module ids to module paths
        // publishes the modulse that are resolved by using the paths against the given ids
        const [moduleNamePathMap] = args

        for (const moduleName in moduleNamePathMap) {
            const modulePath = moduleNamePathMap[moduleName]
            publish(moduleName, acquire(modulePath))
        }

        return acquire
    }

    if (length > 1 && args.every(is.string)) {
        // publish the set of ids
        args.forEach(id => publish(id))
        return acquire
    }

    throw new Error('this code sucks')
}

const fileExtRegexp = /\..+$/
const truePredicate = () => true

const publishDir = (dirPath, predicate = truePredicate) => {
    const [fs, path] = acquire('fs', 'path')

    const moduleIds = fs.readdirSync(path.join(__dirname, dirPath)).filter(predicate).map(name => name.replace(fileExtRegexp, ''))

    for (const id of moduleIds) {
        const modulePath = path.join(dirPath, '/' + id)
        modulesMap[id] = acquire(modulePath)
    }

    return acquire
}

const unpublishAll = () => modulesMap = Object.create(null)

const unpublish = (...ids) => ids.forEach(id => delete modulesMap[id])

acquire.makeGlobal = makeGlobal
acquire.publish = publish
acquire.publishDir = publishDir
acquire.unpublish = unpublish
acquire.unpublishAll = unpublishAll

module.exports = acquire
