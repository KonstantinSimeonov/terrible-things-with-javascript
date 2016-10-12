'use strict';

function knapsack(n, weightCapacity, weights, values) {
    const memory = Array.from({ length: n + 1 }).map(_ => []);

    for (let i = 0; i <= n; i += 1) {

        for (let j = 0; j <= weightCapacity; j += 1) {

            // when you take zero items, you cannot take an item -> you cannot carry value
            // when you can carry zero weight, you cannot take any item -> you cannot carry value
            if ((i === 0) || (j === 0)) {
                memory[i][j] = 0;
            }
            // when you cannot take the current item because it's too heavy
            // you have whatever value you've had until now
            else if (j < weights[i - 1]) {
                memory[i][j] = memory[i - 1][j];
            }
            // when you can take the item
            // calculate if taking it is better than not taking it
            // and take the better value
            else {
                const withItem = values[i - 1] + memory[i - 1][j - weights[i - 1]],
                    withoutItem = memory[i - 1][j];

                memory[i][j] = Math.max(withItem, withoutItem);
            }

        }

    }

    return memory[n][weightCapacity];
}

const weights = [2, 3, 5, 1, 10],
    values = [4, 3, 7, 1, 5];

console.log(knapsack(4, 16, weights, values));