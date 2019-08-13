'use strict';

const { TABLE_SIZE, BYTE_LENGTH } = require('./constants'),
    BinaryHeap = require('./binary-heap');

/**
 * @param {{ charCode: number, children: [] }}
 * @param {string} path
 * @param {function} cb
 */
function dfs(root, path, leafCallback) {
    if (!root.children) {
        leafCallback(root, path || '0');
        return;
    }

    dfs(root.children[0], path + 0, leafCallback);
    dfs(root.children[1], path + 1, leafCallback);
}

/**
 * @param {{amount: number, children: Object[]}} huffmanTreeRoot
 * @returns {Array.<number>}
 */
function computeReplaceTable(huffmanTreeRoot) {
    const replaceTable = [];

    dfs(huffmanTreeRoot, '', (leaf, path) => replaceTable[leaf.charCode] = path);
    return replaceTable;
}

/**
 * @param {Array.<number>} table
 * @returns {{ amount: number, children: [] }}
 */
function getHuffmanTreeRoot(table) {
    const nodes = [];

    for (let i = 0, length = TABLE_SIZE; i < length; i += 1) {
        if (table[i]) {
            nodes.push({
                amount: table[i],
                charCode: i
            });
        }
    }

    const heap = BinaryHeap.from(nodes, (fst, snd) => snd.amount > fst.amount);

    while (heap.size > 1) {
        const fst = heap.pop(),
            snd = heap.pop(),
            combinedNode = { amount: fst.amount + snd.amount, children: [snd, fst] };

        heap.push(combinedNode);
    }

    return heap.top;
}

/**
 * @param {Array.<number>} table
 * @returns {Array.<number>}
 */
function spreadFrequencyTable(table) {
    const result = [];
    

    for (const n of table) {
        result.push(n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255);
    }

    return result;
}

/**
 * @param {Buffer}
 * @returns {Array.<number>}
 */
function unspread(buffer) {
    const freqTable = [];

    for (let i = 0, length = 256; i < length; i += 1) {
        const n = i * 4;
        freqTable.push(buffer[n] | (buffer[n + 1] << 8) | (buffer[n + 2] << 16) | (buffer[n + 3] << 24));
    }

    return freqTable;
}

module.exports = {
    computeReplaceTable,
    dfs,
    getHuffmanTreeRoot,
    spreadFrequencyTable,
    unspread
};