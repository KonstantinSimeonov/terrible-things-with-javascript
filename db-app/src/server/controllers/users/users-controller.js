'use strict'

module.exports = function (users, validate) {

    const pagingSchema = {
        filter: {
            __type: 'complex',
            predicate(value) {
                console.log('value');

                for(const propname in value) {
                    if(typeof value !== 'boolean') {
                        return false;
                    }
                }

                return true;
            }
        },
        pageSize: {
            __type: 'number',
            required: true,
            min: 1,
            max: 100,
            integer: true
        },
        pageNumber: {
            __type: 'number',
            min: 0,
            required: true,
            integer: true
        }
    };

    return {
        paged(req, res, next) {
            // TODO: map and validate paging info

            const pagingInfo = {
                filter: req.query.filter,
                sort: req.query.sort,
                pageSize: Number(req.query.pageSize),
                pageNumber: Number(req.query.pageNumber),
                project: req.query.project
            };

            const errors = validate(pagingSchema, pagingInfo);

            console.log(errors);

            users.page({
                filter: req.query.filter,
                sort: req.query.sort,
                pageSize: Number(req.query.pageSize),
                pageNumber: Number(req.query.pageNumber),
                project: req.query.project
            })
            .then(function (data) {
                res.json(200, data);
                console.log(data);
                next();
            })
            .catch(function (err) {
                res.send(400, err);
                next();
            });
        },
        insert(req, res, next) {
            // TODO: map and validate body

            users
                .insert(req.body.users)
                .then(function (user) {
                    res.json(200, user);
                })
                .catch(function (err) {
                    res.send(400, err);
                    next();
                })
        }
    }
}