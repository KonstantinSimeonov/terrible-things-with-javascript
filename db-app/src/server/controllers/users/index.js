'use strict';

const users = require('../../data/users'),
    validate = require('../../../../../schema-validator/src/schema-validator').default,
    usersController = require('./users-controller')(users, validate);

module.exports = usersController;