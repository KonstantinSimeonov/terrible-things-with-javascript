'use strict';

/** root precision */
const PRECISION = 0.00001,
    /** finite range in which to search for roots */
    RANGE = 10000,
    BINARY_SEARCH_PRECISION = 0.00000001;

/**
 * Raise n to the whole power of p.
 * @param {number} n
 * @param {number} p
 * @returns {number}
 */
function power(n, p) {
    if (p === 0) {
        return 1;
    }

    if (p & 1) {
        return power(n, p - 1) * n;
    }

    const root = power(n, p >> 1);

    return root * root;
}

/**
 * Converts an array of coefficients of a polynomial to a string.
 * @param {[number]} polynomial
 * @returns {string}
 */
function stringifyPolynomial(polynomial) {
    return polynomial.reduce((partial, p, i) => partial + ' + ' + p + 'x^' + i, '0');
}

/**
 * Computes the value of the polynomial function represented by the coefficients array with the given x.
 * @param {[number]} polynomial
 * @param {number} x
 * @returns {number}
 */
function valueFor(polynomial, x) {
    return polynomial.reduce((currentSum, p, i) => currentSum + p * power(x, i), 0);
}

/**
 * Computes the approximate root in the range [low, high] for the polynomial that is represented by the passed coefficients.
 * Returns NaN if a root does not exist in the range [low, high].
 * @param {number} low
 * @param {number} high
 * @param {[number]} polynomial
 * @returns {number}
 */
function findRootInRange(low, high, fn) {

    const valueForLow = fn(low),
        valueForHigh = fn(high),
        increasing = valueForLow < valueForHigh;

    if (Math.sign(valueForLow) * Math.sign(valueForHigh) > 0) {
        return NaN;
    }

    while (true) {
        const middle = (high + low) / 2,
            middleValue = fn(middle);

        if (Math.abs(middleValue) < PRECISION) {
            return middle;
        }

        if ((middleValue > 0) === increasing) {
            high = middle;
        } else {
            low = middle;
        }
    }
}

/**
 * Calculates the derivative of a polynomial defined by coefficients.
 * @param {[number]} polynomial
 * @returns {[number]}
 */
function derivative(polynomial) {
    const result = [];

    for (let i = 1, power = polynomial.length; i < power; i += 1) {
        result.push(polynomial[i] * i);
    }

    return result;
}

/**
 * Approximates the roots of a polynomial by given array of coefficients.
 * @param {[number]} polynomial
 * @returns {[number]}
 */
function approxRoots(polynomial) {
    if(polynomial.length < 2) {
        throw new Error(`Polynomial's power is not high enough`);
    }

    if (polynomial.length === 2) {
        return [-polynomial[0] / polynomial[1]];
    }

    const polynomialDerivative = derivative(polynomial),
        extremums = approxRoots(polynomialDerivative),
        ranges = [-RANGE, ...extremums, RANGE],
        roots = [],
        fn = valueFor.bind(null, polynomial);

    for (let i = 0, len = ranges.length - 1; i < len; i += 1) {
        const r = findRootInRange(ranges[i], ranges[i + 1], fn);

        if (!isNaN(r)) {
            roots.push(r);
        }
    }

    return roots;
}

/** demos below */

const Hx = [-300, -55, 18, 1],
    Px = [-2, 0, 8],
    Tx = [1, -1, 0, 0, 0, 1]; // x^5-x+1

console.log(approxRoots(Hx));
console.log(approxRoots(Px));
console.log(approxRoots(Tx));
// console.log(valueFor(Tx, -1.1673107621076189))

if(typeof module !== undefined) {
    module.exports = {
        power,
        stringifyPolynomial,
        valueFor,
        findRootInRange,
        derivative,
        approxRoots
    };
}