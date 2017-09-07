'use strict';

const https = require('https'),
    fs = require('fs');

function get(url) {
    const body = [];

    return new Promise((resolve, reject) => {
        https.get(url, response$ => {
            response$
                .on('data', chunk => body.push(chunk.toString()))
                .on('error', error => console.log(error) || reject(error))
                .on('end', () => resolve({ body: body.join(), url }));
        })
    });
}

/**
 * @param {[string]} urls
 * @param {number} concurrencyLimit
 * @param {string} path
 * @returns Promise<any>
 */
function download(urls, concurrencyLimit, path) {
    return new Promise((resolve, reject) => {
        let nextUrlIndex = 0;

        function ready({ body, url }) {
            const directory = url.match(/https?:\/\/(.+)\/?/)[1].replace(/\//g, '-');

            fs.writeFile(`${path}/${directory}`, body, console.log);

            if (nextUrlIndex < urls.length) {
                get(urls[nextUrlIndex++]).then(ready).catch(reject);
            } else {
                resolve({ success: true });
            }
        }

        while (nextUrlIndex < concurrencyLimit && nextUrlIndex < urls.length) {
            get(urls[nextUrlIndex++]).then(ready);
        }
    });
}

const urls = ['https://google.com', 'https://telerikacademy.com', 'https://github.com', 'https://nodeschool.io/', 'https://nodejs.org/en/'],
    limit = 2,
    path = `${__dirname}/tmp`;

download(urls, limit, path).then(console.log).catch(console.log);
