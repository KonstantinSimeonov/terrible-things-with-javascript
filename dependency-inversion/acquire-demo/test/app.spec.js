'use strict'

require('../../acquire')

const [{ Readable }, http] = module.acquire('stream', 'http')

// fetch helper
const httpGet = url => new Promise((resolve, reject) => {
    const body = []

    http.get(
        url,
        response => response
            .on('data', chunk => body.push(chunk))
            .on('error', reject)
            .on('end', () => resolve(body.join('')))
    )
})

// stream for test and mocking purposes
const createTestStream = text => {
    const testStream = new Readable
    testStream.push(text)
    testStream.push(null)

    return testStream
}

// tests
const test1 = () => {
    console.log('Test if server responds with text from stream')

    // replace fs with a mock using acquire
    module.acquire.publish('fs', {
        createReadStream: () => createTestStream('thisisteststream')
    })

    // orchestrate and test app code
    require('../app')
        .then(serverUrl => httpGet(serverUrl))
        .then(body => {
            if(body === 'thisisteststream') {
                console.log('PASSING')
            } else {
                console.log('FAILING')
            }
        })
        .catch(error => console.log('FAILING', error))
}

test1()