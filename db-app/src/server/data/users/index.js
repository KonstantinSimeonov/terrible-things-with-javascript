'use strict';

const users = require('./users'),
    connection = require('../connections/mongo-connection'),
    wrapInPromise = require('../common').wrapInPromise,
    collectionName = 'users';
    
module.exports = users(connection, collectionName, wrapInPromise);