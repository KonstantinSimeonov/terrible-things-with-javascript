'use strict';

const unzip = require('unzip'),
    fs = require('fs'),
    path = require('path');

module.exports = function (directory) {
    const zips = fs.readdirSync(directory).filter(fileName => fileName.split('.').pop() === 'zip');

    zips.forEach(function (zipName) {
        const stream = fs.createReadStream(`${directory}/${zipName}`);

        stream.pipe(unzip.Extract({
            path: path.join(directory, '../unzipped/' + zipName)
        }));
    });
}