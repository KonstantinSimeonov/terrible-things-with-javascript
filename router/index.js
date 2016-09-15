'use strict';

const router = createRouter();

router
    .add('gosho/arg/another/', function (params) {
        console.log('zdrasti');
        console.log(params);
    })
    .add('/here/', () => console.log('yass'))
    .use();