'use strict';

const expect = require('chai').expect,
    validate = require('../src/schema-validator').default

describe('Should return errors', () => {

    describe('should return errors for number properties', () => {

        it('should return error when another type is passed', () => {
            const schema = {
                age: {
                    __type: 'number'
                }
            }

            const errors = validate(schema, { age: '' })

            expect(errors.length).to.equal(1)
        })

        it('should return error when value too small is passed', () => {
            const schema = {
                age: {
                    __type: 'number',
                    min: 10
                }
            }

            const errors = validate(schema, { age: -9 })

            expect(errors.length).to.equal(1)
        })

        it('should return error when value is too large', () => {
            const schema = {
                age: {
                    __type: 'number',
                    max: 20
                }
            }

            const errors = validate(schema, { age: 20 })

            expect(errors.length).to.equal(1)
        })

        it('should return error when value is required but is not present on the object', () => {
            const schema = {
                age: {
                    __type: 'number',
                    required: true
                }
            }

            const errors = validate(schema, {})

            expect(errors.length).to.equal(2)
        })

        it('should return error when integer is expected but float is passed', () => {
            const schema = {
                age: {
                    __type: 'number',
                    integer: true
                }
            }

            const errors = validate(schema, { age: 20.5 })

            expect(errors.length).to.equal(1)
        })

        it('should return error when NaN is passed', () => {
            const schema = {
                age: {
                    __type: 'number'
                }
            }

            const errors = validate(schema, { age: NaN })

            expect(errors.length).to.equal(1)
        })
    })

    describe('should return error for boolean properties', () => {

        it('should return error when value of other type is passed', () => {
            const schema = {
                age: {
                    __type: 'number',
                },
                gender: {
                    __type: 'boolean',
                }
            }

            const errors = validate(schema, { age: 3, gender: '' })

            expect(errors.length).to.equal(1)
        })

        it('should return error when the value is required but is not present on an object', () => {
            const schema = {
                age: {
                    __type: 'number',
                },
                gender: {
                    __type: 'boolean',
                    required: true
                }
            }

            const errors = validate(schema, { age: 3 })

            expect(errors.length).to.equal(1)
        })
    })

})