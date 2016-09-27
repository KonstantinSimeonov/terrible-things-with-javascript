'use strict';

function validateLength(constraints, value, errors) {
    if (constraints.minlength && constraints.minlength > value.length) {
        errors.push(new Error(`Expected length to be at least ${constraints.minlength} but got ${value.length}`))
    }

    if (constraints.maxlength && constraints.maxlength <= value.length) {
        errors.push(new Error(`Expected length to be less than ${constraints.maxlength} but got ${value.length}`))
    }
}

function validatePredicate(constraints, value, errors) {
    if (constraints.predicate && !constraints.predicate(value)) {
        errors.push(new Error('Failed predicate validation'))
    }
}

function validateRange(constraints, value, errors) {
    if (constraints.max && constraints.max <= value) {
        errors.push(new Error(`Expected value to be less than ${constraints.max} but got ${value}`))
    }

    if (constraints.min && constraints.min > value) {
        errors.push(new Error(`Expected value to be at least ${constraints.min} but got ${value}`))
    }
}

function validateNull(constraints, value, errors) {
    const isRequired = 'required' in constraints && constraints.required

    if (isRequired && value == undefined) {
        errors.push(new Error(`Value cannot be null or undefined`))
    }
}

function validateType(constraints, value, errors) {
    const type = constraints.type,
        isRequired = 'required' in constraints && constraints.required

    console.log(type, isRequired);

    if (isRequired && typeof value !== type) {
        errors.push(new Error(`Expected value to be of type ${type} but got ${typeof value}`))
    }
}

function validateString(constraints, value) {
    const errors = []

    validateNull(constraints, value, errors)

    validateLength(constraints, value, errors)

    if (constraints.pattern && value.match(constraints.pattern).shift() !== value) {
        errors.push(new Error('Expected to match pattern but did not'))
    }

    validatePredicate(constraints, value, errors)

    return errors
}

function validateNumber(constraints, value) {
    const errors = []

    validateNull(constraints, value, errors)

    validateRange(constraints, value, errors)

    if (constraints.integer && (value | 0) !== value) {
        errors.push(new Error(`Expected integer value but got ${value}`))
    }

    if (constraints.required && !constraints.allowNaN && isNaN(value)) {
        errors.push(new Error(`Expected a number but got ${value}`))
    }

    validatePredicate(constraints, value, errors)

    return errors
}

function validateBoolean(constraints, value) {
    const errors = []

    validateNull(constraints, value, errors)

    return errors
}

function validateEnum(constraints, value) {
    const errors = []

    if (!constraints.allowed.some(v => v === value)) {
        errors.push(new Error(`Expected one of ${constraints.allowed} but got ${value}`))
    }

    return errors
}

const defaultValidationFunctions = {
    enum: validateEnum,
    string: validateString,
    number: validateNumber,
    boolean: validateBoolean,
}

function createValidateFunction(validationFunctions) {
    validationFunctions.complex = createValidateFunction

    return function validate(schema, object) {

        const errors = []

        for (const propName in schema) {

            if (propName === '__type') {
                if (schema.__type !== 'complex') {
                    validateType(schema.__type, typeof object, errors)
                }
                continue
            }

            const subSchema = schema[propName],
                propertyToValidate = object[propName],
                validateProperty = validationFunctions[subSchema.__type]

            if (validateProperty) {
                const propagatedErrors = validateProperty(subSchema, propertyToValidate)
                errors.push(...propagatedErrors)
            }
        }

        return errors
    }
}

module.exports = {
    default: createValidateFunction(defaultValidationFunctions),
    createValidateFunction
};