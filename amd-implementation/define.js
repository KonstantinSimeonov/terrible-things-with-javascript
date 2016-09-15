window.define = (function () {
    'use strict';

    // modules cache
    const modules = {},
        defaultCheckDefinedInterval = 10;

    let configurations = { };

    function loadScriptAsync(name, url) {
        const asyncScript = document.createElement('script');

        asyncScript.type = 'text/javascript';
        asyncScript.async = true;
        asyncScript.src = url;

        document.head.appendChild(asyncScript);

        const checkIfDefinedInterval = configurations.checkIfModuleDeclaredInterval || defaultCheckDefinedInterval;

        return new Promise(function (resolve, reject) {

            asyncScript.addEventListener('load', function onAsyncScriptDomLoad(event) {

                // after loading the script tag, check if the script has executed on every x seconds
                setInterval(function checkIfModuleDeclared() {
                    if (modules[name]) {
                        // the module will be defined by the one of the functions below
                        resolve(modules[name]);

                        // stop checking and clear event listener
                        clearInterval(checkIfModuleDeclared);
                        event.target.removeEventListener('load', onAsyncScriptDomLoad, false);
                    }
                }, checkIfDefinedInterval);
            });
        });

    }

    function defineFromMap(modulesMap) {
        for (let key in modulesMap) {
            modules[key] = modulesMap[key];
        }
    }

    function defineFromFactoryFn(name, dependencyNames, factoryFn) {

        const dependencies = dependencyNames.map(function (depName) {

            if (typeof modules[depName] === 'undefined') {
                // load the dependency using a name and it's url from the configurations
                return loadScriptAsync(depName, configurations.map[depName]);
            }

            return modules[depName];
        });

        Promise
            .all(dependencies)
            .then(function (resolvedDependencies) {
                // when all dependencies are loaded, the factory function is ready to execute
                const moduleToAdd = factoryFn(...resolvedDependencies);
                // if a script execution did not return a module, set to false so it the script won't be reloaded again when the module is requested
                modules[name] = (typeof moduleToAdd !== 'undefined') ? moduleToAdd : false;
            });
    }

    // public facade
    function publicDefine(...args) {
        if (args[0] && typeof args[0] === 'object') {
            return defineFromMap(...args);
        }

        return defineFromFactoryFn(...args);
    }

    publicDefine.config = function (options) {
        if(options && typeof options === 'object') {
            configurations = options;
            return;
        }

        return configurations;
    }

    return publicDefine;
} ());