'use strict';

const fs = require('fs'),
    xlsx = require('./node_modules/node-xlsx/lib/');

const parsed = xlsx.parse('./worksheet functions.xlsx');

const firstSheet = parsed[0];

const name = 'excelFunctions',
    rows = parsed[0].data.slice(1),
    categories = {};

for (const row of rows) {
    if (!categories[row[0]]) {
        categories[row[0]] = [];
    }

    categories[row[0]].push({
        name: row[1],
        description: row[2]
    });
}

fs.writeFile('./worksheet-functions.json', JSON.stringify(categories), err => console.log(err));