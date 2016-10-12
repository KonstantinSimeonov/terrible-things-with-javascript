'use strict';

function knapsack(n, weightCapacity, weights, values) {

    const memory = Array.from({ length: n + 1 }).map(x => []);

    function solve(n, weightCapacity) {
        if (weightCapacity < 0 || n < 0) {
            return 0;
        }

        if(memory[n][weightCapacity] !== undefined) {
            return memory[n][weightCapacity];
        }

        if (weightCapacity < weights[n]) {
            memory[n][weightCapacity] = knapsack(n - 1, weightCapacity, weights, values);

            return memory[n][weightCapacity];
        }

        memory[n][weightCapacity] = Math.max(
            values[n] + knapsack(n - 1, weightCapacity - weights[n], weights, values),
            knapsack(n - 1, weightCapacity, weights, values)
        );

        return memory[n][weightCapacity];
    }

    return solve(n, weightCapacity);
}

const weights = [2, 3, 5, 1, 10],
    values = [4, 3, 7, 1, 5];

console.log(knapsack(4, 16, weights, values));