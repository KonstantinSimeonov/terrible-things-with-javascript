'use strict';

const unzip = require('./unzip'),
    path = require('path'),
    mysql = require('mysql'),
    xslx = require('../../node_modules/node-xlsx/lib/');

const parsed = xslx.parse('./worksheet functions.xlsx');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mariadbkon',
    database: 'testdb'
});

mysqlConnection.connect();

mysqlConnection.query(`CREATE TABLE if not exists categories (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);`, function (err, rows, fields) {
        if (err) {
            return console.log(err);
        }

        console.log('Create categories OK');
    });

mysqlConnection.query(`CREATE TABLE if not exists functions (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(300) NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT \`fk_category\`
            FOREIGN KEY (category_id) REFERENCES categories (id)
            ON DELETE CASCADE
            ON UPDATE RESTRICT 
    );`, function (err, rows, fields) {
        if (err) {
            return console.log(err);
        }

        console.log('Create functions OK');
    });

const rows = parsed[0].data.slice(1),
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

const values = Object.keys(categories).map(cat => `('${cat}')`).join(', ');

const insertCmd = `INSERT INTO categories (name) VALUES ${values};`;

// mysqlConnection.query(insertCmd, function (err, rows, fields) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log(rows);
// })

// mysqlConnection.query('SELECT * FROM categories;', function (err, rows, fields) {
//     if (err) {
//         return console.log(err);
//     }


//     const functionValues = [];

//     for (const cat of rows) {
//         const functionsOfCat = categories[cat.name].map(fn => `('${fn.name}', '${fn.description}', ${cat.id})`);

//         functionValues.push(...functionsOfCat);
//     }

//     const insertFunctionsCommand = `INSERT INTO functions (name, description, category_id) VALUES ${functionValues.join(', ')};`;

//     mysqlConnection.query(insertFunctionsCommand, function (err, rows, fields) {
//         if (err) {
//             return console.log(err);
//         }

//         console.log(rows);
//         mysqlConnection.end();
//     });
// });

const promise = new Promise(function (resolve, reject) {
    mysqlConnection.query('SELECT category_id, COUNT(*) as count from functions GROUP BY category_id', (err, rows) => err ? reject(err) : resolve(rows));
});

promise.then(function (data) {
    console.log(data);
    mysqlConnection.end();
});



// m, kjb kmb lk jg hf ikj;l.
// pumata kazva che tova shte struva milioni. amin!
// unzip(path.join(__dirname, './zips'));