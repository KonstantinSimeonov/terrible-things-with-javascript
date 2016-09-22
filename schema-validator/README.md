# Schema validator

## Description
- Aims to provide declarative validation by using schemes that are javascript objects.

## Sample usage

```js
const validate = require('./src/schema-validator.js'),
    personSchema = {
        name: {
            __type: 'string',
            maxlength: 30,
            pattern: /[a-z]+/i,
            required: true
        },
        age: {
            __type: 'number',
            min: 0,
            max: 120,
            integer: true,
            required: true
        },
        dog: {
            __type: 'complex',
            name: {
                __type: 'string'
            },
            fur: {
                __type: 'string'
            }
        }
    },
    person = {
        name: 'John',
        age: 5,
        dog: {
            name: 'Sparky',
            fur: 'brown'
        }
    };

console.log(validate(personSchema, person));
```