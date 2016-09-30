'use strict'

function ValidationError(type, propertyName, message) {

    Error.captureStackTrace(this, ValidationError)
    this.message = message
    this.type = type
    this.propertyName = propertyName
}

ValidationError.prototype = Object.create(Error.prototype)

function validateLength(constraints, value, errors, propName) {
    if (constraints.minlength && constraints.minlength > value.length) {
        errors.push(new ValidationError('tooShortError', propName, `Expected length to be at least ${constraints.minlength} but got ${value.length}`))
    }

    if (constraints.maxlength && constraints.maxlength <= value.length) {
        errors.push(new ValidationError('tooLongError', propName, `Expected length to be less than ${constraints.maxlength} but got ${value.length}`))
    }
}

function validatePredicate(constraints, value, errors, propName) {
    if (constraints.predicate && !constraints.predicate(value)) {
        errors.push(new ValidationError('predicateError', propName,'Failed predicate validation'))
    }
}

function validateRange(constraints, value, errors, propName) {
    if (constraints.max && constraints.max <= value) {
        errors.push(new ValidationError('tooLargeError', propName, `Expected value to be less than ${constraints.max} but got ${value}`))
    }

    if (constraints.min && constraints.min > value) {
        errors.push(new ValidationError('tooSmallError', propName,`Expected value to be at least ${constraints.min} but got ${value}`))
    }
}

function validateNull(constraints, value, errors, propName) {
    const isRequired = 'required' in constraints && constraints.required

    if (isRequired && value == undefined) {
        errors.push(new ValidationError('nullOrUndefinedError', propName, `Value cannot be null or undefined`))
    }
}

function validateType(constraints, value, errors, propName) {
    const type = constraints.__type,
        isRequired = 'required' in constraints && constraints.required

    if (isRequired && typeof value !== type) {
        errors.push(new ValidationError('typeError', propName,`Expected value to be of type ${type} but got ${typeof value}`))
    }
}

function validateString(constraints, value, propName) {
    const errors = []

    validateNull(constraints, value, errors)

    validateLength(constraints, value, errors)

    if (constraints.pattern && value.match(constraints.pattern).shift() !== value) {
        errors.push(new ValidationError('regexpMismatchError', propName, 'Expected to match pattern but did not'))
    }

    validatePredicate(constraints, value, errors)

    return errors
}

function validateNumber(constraints, value, propName) {
    const errors = []

    validateNull(constraints, value, errors, propName)

    validateRange(constraints, value, errors, propName)

    if (constraints.integer && (value | 0) !== value) {
        errors.push(new ValidationError('notIntegerError', propName,`Expected integer value but got ${value}`))
    }

    if (constraints.required && !constraints.allowNaN && isNaN(value)) {
        errors.push(new ValidationError('nullOrUndefinedError', propName, `Expected a number but got ${value}`))
    }

    validatePredicate(constraints, value, errors)

    return errors
}

function validateBoolean(constraints, value, propName) {
    const errors = []

    validateNull(constraints, value, errors, propName)

    return errors
}

function validateEnum(constraints, value, propName) {
    const errors = []

    if (!constraints.allowed.some(v => v === value)) {
        errors.push(new ValidationError('invalidEnumError', propName, `Expected one of ${constraints.allowed} but got ${value}`))
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


    function validate(schema, object) {

        const errors = []

        validateType(schema, object, errors)

        if ('__type' in schema && 'required' in schema) {

            if (errors.length && schema.required) {
                return errors
            } else if (!schema.required) {
                return []
            }
        }

        for (const propName in schema) {

            if (propName === '__type') {
                continue
            }

            const subSchema = schema[propName],
                propertyToValidate = object[propName],
                validateProperty = validationFunctions[subSchema.__type]

            if (validateProperty) {
                const propagatedErrors = validateProperty(subSchema, propertyToValidate, propName)
                errors.push(...propagatedErrors)
            }
        }

        return errors
    }

    validationFunctions.object = validate

    return validate
}

module.exports = {
    default: createValidateFunction(defaultValidationFunctions),
    createValidateFunction
};