'use strict';

const connectionPromise = require('../connections/mongo-connection'),
    collectionName = 'contests',
    contests = require('./contests'),
    wrapInPromise = require('../common').wrapInPromise;

module.exports = contests(connectionPromise, collectionName, wrapInPromise);