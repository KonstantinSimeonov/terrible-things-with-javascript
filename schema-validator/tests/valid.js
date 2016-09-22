'use strict';

const expect = require('chai').expect,
    validate = require('../src/schema-validator').default

describe('Should return no errors', () => {

    describe('valid number properties', () => {

        it("shouldn't return errors for number in valid range", () => {
            const schema = {
                age: {
                    __type: 'number',
                    min: 10,
                    max: 20
                }
            }

            for(let i = 10; i < schema.age.max; i += 1) {
                const errors = validate(schema, { age: i })

                expect(errors.length).to.equal(0)
            }
        })

        it("shouldn't return errors for number when integer flag is passed", () => {
            const schema = {
                age: {
                    __type: 'number',
                    integer: true
                }
            }

            const errors = validate(schema, { age: 33 })

            expect(errors.length).to.equal(0)
        })

        it("shouldn't return errors for NaN when allowNaN is true", () => {
            const schema = {
                age: {
                    __type: 'number',
                    allowNan: true
                }
            }

            const errors = validate(schema, { age: NaN })

            expect(errors.length).to.equal(0)
        })
        
    })

})