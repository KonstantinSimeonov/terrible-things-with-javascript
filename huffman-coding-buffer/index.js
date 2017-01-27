'use strict';

const BinaryHeap = require('../shared/binary-heap');

const TABLE_SIZE = 256,
    BYTE_LENGTH = 8;

/**
 * @param {Array.<string>} strings
 * @returns {Array.<number>}
 */
function distributeIntoBytes(strings) {
    const bytes = [];

    let current = 0,
        currentBitCount = 0;

    for (let i = 0, length = strings.length; i < length; i += 1) {
        for (let j = 0, l2 = strings[i].length; j < l2; j += 1) {
            if (currentBitCount >= BYTE_LENGTH) {
                bytes.push(current);
                current = 0;
                currentBitCount = 0;
            }

            current = (current << 1) | strings[i][j];
            currentBitCount += 1;
        }
    }

    if (currentBitCount) {
        bytes.push(current << (BYTE_LENGTH - currentBitCount));
    }

    return bytes;
}

/**
 * @param {string} content
 * @returns {Array.<number>}
 */
function computeFrequencyTable(content) {
    const result = Array.from({ length: TABLE_SIZE }).fill(0);

    for (let i = 0, length = content.length; i < length; i += 1) {
        const asciiCode = content.charCodeAt(i);
        result[asciiCode] += 1;
    }

    return result;
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
 * @param {string} content
 * @returns {Buffer}
 */
function huffmanCompress(content) {
    const frequencyTable = computeFrequencyTable(content),
        huffmanTreeRoot = getHuffmanTreeRoot(frequencyTable),
        replaceTable = [];

    dfs(huffmanTreeRoot, '', (leaf, path) => replaceTable[leaf.charCode] = path);

    const compressed = [];

    for (let i = 0, length = content.length; i < length; i += 1) {
        compressed[i] = replaceTable[content[i].charCodeAt(0)];
    }

    const bytes = distributeIntoBytes(compressed);

    return Buffer.from([...frequencyTable, ...bytes]);
}

/**
 * @param {Buffer} buffer
 * @returns {string}
 */
function huffmanDecompress(buffer) {
    const huffmanTreeRoot = getHuffmanTreeRoot(buffer),
        output = [];

    let current = huffmanTreeRoot,
        sum = 0;

    for (let i = 0; i < TABLE_SIZE; i += 1) {
        sum += buffer[i];
    }

    for (let i = TABLE_SIZE; i < buffer.length; i += 1) {
        for (let j = BYTE_LENGTH - 1; j >= 0; j -= 1) {
            const bit = (buffer[i] >> j) & 1;
            current = current.children[bit];

            if (!current.children) {
                output.push(String.fromCharCode(current.charCode));
                current = huffmanTreeRoot;

                if (output.length === sum) {
                    break;
                }
            }
        }
    }

    return output.join('');
}

module.exports = {
    compress: huffmanCompress,
    decompress: huffmanDecompress
};