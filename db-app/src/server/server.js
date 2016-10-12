'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    contests = require('./data/contests');

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// server.get('/echo', function (req, res, next) {
//     res.json(200, { hello: 'gosho', query: req.params});

//     return next();
// });

require('./routers')(server);

server.listen(8001, () => console.log('http://localhost:8001'));

// m, kjb kmb lk jg hf ikj;l.
// pumata kazva che tova shte struva milioni. amin!