'use strict';

const fs = require('fs'),
    path = require('path'),
    routers = fs.readdirSync(__dirname).filter(fn => fn.indexOf('-router.js') !== -1);

module.exports = function (server) {
    console.log(routers);
    routers.forEach(name => require(path.join(__dirname, '/' + name))(server));
}