'use strict';

const connectionPromise = require('../connections/mongo-connection'),
    collectionName = 'contests',
    wrapInPromise = require('../common').wrapInPromise,
    contests = require('./contests');

module.exports = contests(connectionPromise, collectionName, wrapInPromise);