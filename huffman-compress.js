'use strict';

const BinaryHeap = require('./binary-heap');

/**
 * @param {string} content
 * @returns {Array.<number>}
 */
function computeTable(content) {
    const result = Array.from({ length: 256 }).fill(0);

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
function createHuffmanTree(table) {

    const nodes = [];

    for (let i = 0, length = 256; i < length; i += 1) {
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

function dfs(root, path, cb) {
    if (!root.children) {
        cb(root, path || '0');
        return;
    }

    dfs(root.children[0], path + 0, cb);
    dfs(root.children[1], path + 1, cb);
}

/**
 * @param {string} content
 * @returns {Buffer}
 */
function huffmanCompress(content) {
    const frequencyTable = computeTable(content),
        huffmanTreeRoot = createHuffmanTree(frequencyTable),
        replaceTable = [];

    dfs(huffmanTreeRoot, '', (leaf, path) => replaceTable[leaf.charCode] = path);

    const compressed = [];

    for (let i = 0, length = content.length; i < length; i += 1) {
        compressed[i] = replaceTable[content[i].charCodeAt(0)];
    }

    compressed.push('0000000');

    // TODO: optimize
    const bytes = compressed
        .join('')
        .match(/.{8}/g) // cyki kazva tochno 8!
        .map(x => parseInt(x, 2));

    return Buffer.from([...frequencyTable, ...bytes]);
}

/**
 * @param {Buffer} buffer
 * @returns {string}
 */
function huffmanDecompress(buffer) {
    const huffmanTreeRoot = createHuffmanTree(buffer),
        output = [];

    let current = huffmanTreeRoot,
        sum = 0;

    for(let i = 0; i < 256; i += 1) {
        sum += buffer[i];
    }

    for (let i = 256; i < buffer.length; i += 1) {
        for (let j = 7; j >= 0; j -= 1) {
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