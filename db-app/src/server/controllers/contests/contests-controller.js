'use strict';

module.exports = function (contests, users, validate) {

    return {
        byId(req, res) {
            const id = req.body.id;
            // TODO: validation

            contests
                .first({ _id: id })
                .then(contest => res.status(200).json(contest))
                .catch(err => res.status(500).json(err));
        },
        paged(req, res) {
            contests
                .page({
                    filter: req.query.filter,
                    showDeleted: req.query.showDeleted,
                    sort: req.query.sort,
                    pageSize: Number(req.query.pageSize),
                    pageNumber: Number(req.query.pageNumber),
                    project: req.query.project
                })
                .then(contest => res.status(200).json(contest.map(c => { c.startDate = new Date(c.startDate * 1000); return c; })))
                .catch(err => res.status(500).json(err));
        },
        getUpcomingContests(req, res) {

            contests
                .page({
                    pageSize: 11,
                    pageNumber: 0,
                    sort: { startDate: -1 },
                    filter: { 'startDate': { '$gte': new Date().getTime() / 1000 } }
                })
                .then(dbRes => {

                    res.status(200).json(dbRes)
                })
                .catch(err => res.status(500).json(err));
        },
        insertContest(req, res) {

            contests
                .insert(req.body.contests.map(function (contest) {
                    contest.startDate = new Date(contest.startDate).getTime() / 1000;
                    contest.endDate = new Date(contest.endDate).getTime() / 1000;
                    contest.creationdate = new Date(contest.creationDate).getTime() / 1000;

                    return contest;
                }))
                .then(dbRes => res.status(201).json(dbRes.ops))
                .catch(err => res.status(500).json(err));
        }
    }
}