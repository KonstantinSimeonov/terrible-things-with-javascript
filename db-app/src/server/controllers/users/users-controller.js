'use strict'

const fs = require('fs'),
    upload = require('../../services/file-upload.js');

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
        paged(req, res) {
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
                res.status(400).json(errors);
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
                .then(data => res.status(200).json(data))
                .catch(err => res.status(400).json(err));
        },
        byId(req, res) {

            users
                .first({ _id: req.params.id })
                .then(user => res.status(200).json(user))
                .catch(err => res.status(500).json(err))
        },
        remove(req, res) {
            users
                .remove({ _id: req.params.id })
                .then(removedUser => res.status(200).json(removedUser))
                .catch(err => res.status(500).json(err));
        },
        insert(req, res) {
            // TODO: map and validate body

            users
                .insert(req.body.users)
                .then(() => res.status(200).json(user))
                .catch(err => res.status(400).json(err));
        },
        uploadJsonService(req, res) {

            upload
                .loadFormTo(req, '../../uploads')
                .then(function (filePaths) {
                    
                    const fileContents = filePaths.map(function (fp) {
                        const fileContentPromise = new Promise(function (fullfill, reject) {
                            fs.readFile(fp, 'utf8', (err, contents) => err ? reject(err) : fullfill(contents));
                        });

                        return fileContentPromise;
                    });

                    return Promise.all(fileContents);
                })
                .then(function (contents) {
                    const jsonContents = contents
                                            .map(JSON.parse)
                                            .reduce((soFar, current) => soFar.concat(current), []);

                    return users.insert(jsonContents);
                })
                .then(function (dbResponse) {
                    res.status(201)
                        .json({
                            added: dbResponse.ops.map(o => o.username)
                        });
                })
                .catch(err => res.status(500).json(err.message));
                
        }
    }
}