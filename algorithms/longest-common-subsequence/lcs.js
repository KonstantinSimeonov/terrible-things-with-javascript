function lcs(first, second) {
    const memory = Array.from({ length: first.length + 1 }).map(_ => []);

    for(let i = 0, firstLen = first.length; i <= firstLen; i += 1) {

        for(let j = 0, secondLen = second.length; j <= secondLen; j += 1) {

            if((i === 0) || (j === 0)) {
                memory[i][j] = 0;
            } else if(first[i - 1] === second[j - 1]) {
                memory[i][j] = memory[i - 1][j - 1] + 1;
            } else {
                memory[i][j] = Math.max(memory[i - 1][j], memory[i][j - 1]);
            }
        }
    }

    return memory;
}

const first = 'abc xxxxdefg',
    second =  'bcbcd defga',
    table = lcs(first, second);

console.log(table);

const result = [];

function backtrack(first, second, table, i, j) {
    if(i === 0 || j === 0) {
        return;
    }

    if(first[i - 1] === second[j - 1]) {
        backtrack(first, second, table, i - 1, j - 1);
        return result.push(first[i - 1]);
    }

    if(table[i - 1][j] < table[i][j - 1]) {
        return backtrack(first, second, table, i, j - 1);
    }

    return backtrack(first, second, table, i - 1, j);
}

backtrack(first, second, table, first.length, second.length);

console.log(result);