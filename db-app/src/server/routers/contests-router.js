'use strict';

const contestsController = require('../controllers/contests');

module.exports = function (server) {
    console.log('hello');
    server
        .get('/api/contests/upcoming', contestsController.getUpcomingContests)
        .get('/api/contests/:id/details', contestsController.byId)
        .get('/api/contests', contestsController.paged)
        .post('/api/contests/insert', contestsController.insertContest);
}