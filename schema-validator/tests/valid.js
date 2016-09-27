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

    describe('valid string properties', () => {

        it('shouldn`t return errors when string type is expected and required and a string value is provided', () => {
            const schema = {
                firstname: {
                    __type: 'string',
                    required: true
                }
            }

            const errors = validate(schema, { firstname: 'ivan' })

            expect(errors.length).to.equal(0)
        })

        it('shouldn`t return errors when string length is in allowed range', () => {
            const schema = {
                name: {
                    __type: 'string',
                    required: true,
                    minlength: 2,
                    maxlength: 20
                }
            }

            let name = 'aa'

            for(let i = name.length; i < 20; i += 1) {
                const errors = validate(schema, { name })
                expect(errors.length).to.equal(0)

                name += 'a'
            }
        })

        it('shouldn`t return errors when string matches the regexp pattern', () => {
            const schema = {
                name: {
                    __type: 'string',
                    required: true,
                    pattern: /[a-z]+/i
                }
            }

            const errors = validate(schema, { name: 'dfdgJAJSadsf' })

            expect(errors.length).to.equal(0)
        })

        it('shouldn`t return errors when string fullfills the predicate', () => {
            const schema = {
                name: {
                    __type: 'string',
                    predicate: value => value.split('p').length > 5
                }
            }

            const errors = validate(schema, { name: 'pizza people peter pancakes with cuprum popup pendulum' })

            expect(errors.length).to.equal(0)
        })
    })

})