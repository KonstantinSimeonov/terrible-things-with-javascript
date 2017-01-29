'use strict';

const fs = require('fs'),
    Transform = require('stream').Transform,
    BinaryHeap = require('../shared/binary-heap');

const TABLE_SIZE = 256,
    BYTE_LENGTH = 8;

/**
* @param {string} chunk
* @param {Array.<number>} freqTable
*/
function updateTableWithChunk(chunk, freqTable) {
    for (let i = 0, chunkLength = chunk.length; i < chunkLength; i += 1) {
        freqTable[chunk[i]] += 1;
    }
}

/**
 * @param {stream.Readable} readStream$
 * @returns {Promise.<Array.<number>>}
 */
function computeFrequencyTable(readStream$) {
    const freqTable = Array.from({ length: TABLE_SIZE }).fill(0);

    readStream$.on('data', chunk => updateTableWithChunk(chunk, freqTable));

    return new Promise((resolve, reject) => {
        readStream$.on('end', () => resolve(freqTable));
        readStream$.on('error', err => reject(err));
    });
}

/**
 * @param {Array.<number>} freqTable
 * @returns {{ amount: number, children: Object[] }}
 */
function getHuffmanTreeRoot(freqTable) {

    const nodes = [];

    for (let i = 0; i < TABLE_SIZE; i += 1) {
        if (freqTable[i]) {
            nodes.push({
                charCode: i,
                amount: freqTable[i]
            });
        }
    }

    const heap = BinaryHeap.from(nodes, (fst, snd) => fst.amount < snd.amount);

    while (heap.size !== 1) {
        const fst = heap.pop(),
            snd = heap.pop(),
            parent = { amount: fst.amount + snd.amount, children: [snd, fst] };

        heap.push(parent);
    }

    return heap.top;
}

function dfs(root, path, leafCallback) {
    if (!root.children) {
        leafCallback(root, path || '0');
        return;
    }

    dfs(root.children[0], path + 0, leafCallback);
    dfs(root.children[1], path + 1, leafCallback);
}

function computeReplaceTable(huffmanTreeRoot) {
    const replaceTable = [];

    dfs(huffmanTreeRoot, '', (leaf, path) => replaceTable[leaf.charCode] = path);
    return replaceTable;
}

function spreadFrequencyTable(table) {
    const result = [];

    for (const n of table) {
        result.push(n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255);
    }

    return result;
}

class HuffmanCompressStream extends Transform {
    /**
     * @param {Array.<number>} frequencyTable
     */
    static from(frequencyTable, options) {
        return new HuffmanCompressStream(frequencyTable, options);
    }

    /**
     * @param {Array.<number>} frequencyTable
     */
    constructor(frequencyTable, options) {
        super(options);
        
        // bytesLeftCount is used to determine when to write the last byte
        this.bytesLeftCount = frequencyTable.reduce((sum, next) => sum + next, 0);

        this.huffmanRoot = getHuffmanTreeRoot(frequencyTable);
        this.spreadTable = spreadFrequencyTable(frequencyTable);
        this.replaceTable = computeReplaceTable(this.huffmanRoot);

        // always write the spread frequency table first
        this.push(Buffer.from(this.spreadTable));

        this.byte = 0;
        this.currentByteBitsCount = 0;
    }

    /**
     * @param {Buffer} chunk
     * @param {?string} encoding
     * @param {function} callback
     */
    _transform(chunk, encoding, callback) {
        const compressed = [].map.call(chunk, b => this.replaceTable[b]),
            output = [];

        for (let i = 0, length = compressed.length; i < length; i += 1) {
            for (let j = 0, l2 = compressed[i].length; j < l2; j += 1) {
                this.byte = (this.byte << 1) | compressed[i][j];
                this.currentByteBitsCount += 1;

                if (this.currentByteBitsCount >= BYTE_LENGTH) {
                    output.push(this.byte);
                    this.byte = 0;
                    this.currentByteBitsCount = 0;
                }
            }
        }

        this.bytesLeftCount -= chunk.length;

        if (!this.bytesLeftCount) {
            output.push(this.byte << BYTE_LENGTH - this.currentByteBitsCount);
        }

        const chunkToWrite = Buffer.from(output);
        this.push(chunkToWrite, encoding);
        callback();
    }
}

function compress(path, dest) {
    const srcTable$ = fs.createReadStream(path);

    computeFrequencyTable(srcTable$)
        .then(frequencyTable => {
            const src$ = fs.createReadStream(path),
                dest$ = fs.createWriteStream(dest),
                compressor$ = HuffmanCompressStream.from(frequencyTable);

            src$.pipe(compressor$).pipe(dest$);
        });
}

module.exports = {
    compress
};