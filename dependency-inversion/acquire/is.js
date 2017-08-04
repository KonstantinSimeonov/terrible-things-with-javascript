const obj = Object.freeze({});
const str = '';

const areTypesEqual = (v1, v2) => Object.prototype.toString.call(v1) === Object.prototype.toString.call(v2)

module.exports = {
    object: value => areTypesEqual(value, obj),
    string: value => areTypesEqual(value, str)
}