'use strict';

const usersController = require('../controllers/users');

module.exports = function (server) {
    server.get('/users', usersController.paged);
    server.get('/users/:id/details', usersController.byId);
    server.post('/users', usersController.insert);
    server.del('/users/:id/remove', usersController.remove)
}