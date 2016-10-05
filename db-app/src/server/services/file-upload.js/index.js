'use strict';

const formidable = require('formidable'),
    path = require('path');

function loadFormTo(request, uploadsDir) {
    const form = new formidable.IncomingForm();

    form.on('fileBegin', function (name, file) {
        file.path = path.join(__dirname, uploadsDir + '/' + name);
    });

    return new Promise(function (fullfill, reject) {

        form.parse(request, function (err, fields, files) {

            if(err) {
                return reject(err);
            }
        });

        form.on('end', function(fields, files) {
            fullfill(this.openedFiles.map(file => file.path));
        });

    });
}

module.exports = { loadFormTo };