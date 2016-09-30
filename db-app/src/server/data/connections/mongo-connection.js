'use strict'

const mongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/pjs-db';

module.exports = mongoClient.connect(url);