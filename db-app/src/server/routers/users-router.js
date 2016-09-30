'use strict';

const usersController = require('../controllers/users');

module.exports = function (server) {
    server.get('/users', usersController.paged);
    server.post('/users', usersController.insert);
}