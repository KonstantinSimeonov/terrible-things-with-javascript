'use strict'

module.exports = function (users, validate) {

    const pagingSchema = {
        filter: {
            __type: 'complex'
        },
        project: {
            __type: 'complex',
            predicate(value) {

                for (const propname in value) {
                    if (typeof value[propname] !== 'boolean') {
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

            if (errors.length) {
                res.status(400).json(errors)
                next();
                return;
            }

            users.page({
                filter: req.query.filter,
                showDeleted: req.query.showDeleted,
                sort: req.query.sort,
                pageSize: Number(req.query.pageSize),
                pageNumber: Number(req.query.pageNumber),
                project: req.query.project
            })
                .then(function (data) {
                    res.status(200).json(data);
                    next();
                })
                .catch(function (err) {
                    res.status(400).json(err);
                    next();
                });
        },
        byId(req, res, next) {

            users
                .first({ _id: req.params.id })
                .then(function (user) {
                    res.status(200).json(user);
                    next();
                })
                .catch(function (err) {
                    res.status(500).json(err);
                    next();
                })
        },
        remove(req, res, next) {

            users
                .remove({ _id: req.params.id })
                .then(function (removedUser) {
                    res.status(200).json(removedUser);
                    next();
                })
                .catch(function (err) {
                    res.status(500).json(err);
                    next();
                })
        },
        insert(req, res, next) {
            // TODO: map and validate body

            users
                .insert(req.body.users)
                .then(function (user) {
                    res.status(200).json(user);
                })
                .catch(function (err) {
                    res.status(400).json(err);
                    next();
                });
        }
    }
}