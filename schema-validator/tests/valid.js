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
                    allowNaN: true
                }
            }

            const errors = validate(schema, { age: NaN })

            expect(errors.length).to.equal(0)
        })
    })

    describe('valid boolean properties', () => {

        it('shouldn`t return errors when boolean property has boolean value "true"', () => {
            const schema = {
                age: {
                    __type: 'number',
                },
                gender: {
                    __type: 'boolean',
                    required: true
                }
            }

            const errors = validate(schema, { age: 3, gender: true })

            expect(errors.length).to.equal(0)
        })

        it('shouldn`t return errors when boolean property has boolean value "false"', () => {
            const schema = {
                age: {
                    __type: 'number',
                },
                gender: {
                    __type: 'boolean',
                    required: true
                }
            }

            const errors = validate(schema, { age: 3, gender: false })

            expect(errors.length).to.equal(0)
        })

        it('shouldn`t return errors when boolean property is not required', () => {

            const schema = {
                age: {
                    __type: 'number',
                },
                gender: {
                    __type: 'boolean',
                    required: false
                }
            }

            const errors = validate(schema, { age: 3 })

            expect(errors.length).to.equal(0)
        })

    })

})