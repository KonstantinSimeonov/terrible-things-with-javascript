const createRouter = (function () {

    'use strict';

    function clearSlashes(path) {
        const start = path[0] === '/',
            end = path[path.length - 1] === '/';

        return path.substring(+start, path.length - end);
    }

    function addRoute(routeExpression, handler) {
        if(typeof routeExpression === 'string') {
            routeExpression = clearSlashes(routeExpression);
        }

        this.routes.push({ routeExpression, handler });

        return this;
    }

    function parseParams(paramString) {
        if(!paramString) {
            return;
        }

        const params = {},
            paramsList = paramString.split('&').forEach(function (pair) {
                pair = pair.split('=');
                const key = pair[0];
                params[key] = pair[1];
            });

        return params;
    }

    function getFragments() {
        const fragments = decodeURI(clearSlashes(window.location.hash.substr(1))).split('?');

        return {
            route: fragments[0],
            params: parseParams(fragments[1])
        }
    }

    function executeRouteHandler(pathFragments) {

        const path = pathFragments.route,
            params = pathFragments.params;

        for (let route of this.routes) {
            let isMatch = false;

            if (typeof route === 'function') {
                isMatch = route.routeExpression.test(path);
            } else {
                isMatch = route.routeExpression === path;
            }

            if (isMatch) {
                route.handler(params);
                return;
            }
        }
    }

    function useRouter() {
        const self = this;

        window.addEventListener('hashchange', function () {
            const fragments = self.fragments();

            executeRouteHandler.call(self, fragments);
        });
    }

    const router = {
        routes: [],
        add: addRoute,
        fragments: getFragments,
        executeRoute: executeRouteHandler,
        use: useRouter
    };

    return Object.create.bind(Object, router);
} ());