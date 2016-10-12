'use strict';

function knapsack(n, weightCapacity, weights, values) {
    if(weightCapacity < 0 || n < 0)
        return 0;

    if(weightCapacity < weights[n])
        return knapsack(n - 1, weightCapacity, weights, values);
    
    return Math.max(
        values[n] + knapsack(n - 1, weightCapacity - weights[n], values),
        knapsack(n - 1, weightCapacity, weights, values)
    );
}

const weights = [2, 3, 5, 1, 10],
    values = [4, 3, 7, 1, 5];

console.log(knapsack(4, 16, weights, values));