'use strict';

const usersController = require('../controllers/users');

module.exports = function (server) {
    server
        .get('/users', usersController.paged)
        .get('/users/json-upload', usersController.uploadJsonForm)
        .post('/users/json-upload', usersController.uploadJson)
        .get('/users/:id/details', usersController.byId)
        .post('/users', usersController.insert)
        .delete('/users/:id/remove', usersController.remove)
}