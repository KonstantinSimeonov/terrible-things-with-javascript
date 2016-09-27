'use strict';

const contests = require('./data/contests');

function mapParams(url) {
    return url.split('?')
        .pop()
        .split('&')
        .map(pair => pair.split('='))
        .reduce(function (params, currentPair) {
            params[currentPair[0]] = currentPair[1];
            return params;
        }, {});
}

const http = require('http'),
    server = http.createServer(function (req, res) {

        res.json = function (object) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(object));
            res.end();
        }

        if (req.url.indexOf('/contests') === 0) {
            const queryParams = mapParams(req.url);

            console.log(queryParams);

            contests.page({
                pageSize: +queryParams.pagesize,
                pageNumber: +queryParams.page,
                sort: { creationDate: 1 },
                project: { name: true, startDate: true, endDate: true }
            }).then(res.json);
        }

    });

server.listen(1234, () => console.log('Server listening on port 1234'));


// m, kjb kmb lk jg hf ikj;l.
// pumata kazva che tova shte struva milioni. amin!