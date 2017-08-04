'use strict'

require('../acquire').makeGlobal()

const [http, fs, config, db] = acquire('http', 'fs', './modules/config', './modules/db', __dirname)

const server = http.createServer((req, res) => fs.createReadStream('../acquire/index.js').pipe(res))

const port = 6969

module.exports = new Promise((resolve, reject) => {
    server.listen(port, () => {
        console.log(`magic happening on localhost:${port}`);
        resolve(`http://localhost:${port}`);
    })
})
