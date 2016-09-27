'use strict'

const mongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/testtest'

module.exports = mongoClient.connect(url)