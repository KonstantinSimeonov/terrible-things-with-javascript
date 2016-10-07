'use strict';

const usersController = require('../controllers/users');

module.exports = function (server) {
    server
        .get('api/users', usersController.paged)
        .get('api/users/json-upload', usersController.uploadJsonForm)
        .post('api/users/json-upload', usersController.uploadJsonService)
        .get('api/users/:id/details', usersController.byId)
        .post('api/users', usersController.insert)
        .delete('api/users/:id/remove', usersController.remove)
}