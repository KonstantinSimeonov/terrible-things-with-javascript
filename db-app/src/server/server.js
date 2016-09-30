'use strict';

const restify = require('restify'),
    contests = require('./data/contests');

const server = restify.createServer({
    name: 'gosho'
});

server.use(restify.queryParser());
server.use(restify.bodyParser());

// server.get('/echo', function (req, res, next) {
//     res.json(200, { hello: 'gosho', query: req.params});

//     return next();
// });

require('./routers/users-router')(server);

server.listen(8001, () => console.log('http://localhost:8001'));

// m, kjb kmb lk jg hf ikj;l.
// pumata kazva che tova shte struva milioni. amin!