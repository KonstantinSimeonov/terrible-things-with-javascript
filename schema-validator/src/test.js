'use strict';

const validate = require('./schema-validator').default;

const pagingSchema = {
        filter: {
            __type: 'object',
            required: false,
            predicate(value) {
                

                for(const propname in value) {
                    if(typeof value !== 'boolean') {
                        return false;
                    }
                }

                return true;
            }
        },
        pageSize: {
            __type: 'number',
            required: true,
            min: 1,
            max: 100,
            integer: true
        },
        pageNumber: {
            __type: 'number',
            min: 0,
            required: true,
            integer: true
        }
    };

const page = {
    pageSize: 5,
    pageNumber: 0
}

const errors = validate(pagingSchema, page);

console.log(errors);