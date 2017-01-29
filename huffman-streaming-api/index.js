'use strict';

const fs = require('fs');

const BinaryHeap = require('../shared/binary-heap');

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

    for(const n of table) {
        result.push(n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255);
    }

    return result;
}

function compress(path) {
    const tableReadStream$ = fs.createReadStream(path);
    let compressReadStream$ = fs.createReadStream(path);
    let compressWriteStream$;

    computeFrequencyTable(tableReadStream$)
        .then(freqTable => {
            const huffmanRoot = getHuffmanTreeRoot(freqTable),
                replaceTable = computeReplaceTable(huffmanRoot);

            let byte = 0,
                currentByteBitsCount = 0;

            compressWriteStream$ = fs.createWriteStream(path + '.min', { encoding: 'ascii' });

            const spreadTable = spreadFrequencyTable(freqTable);
            compressWriteStream$.write(Buffer.from(spreadTable), () => console.log('writing freq table'));
            
            compressWriteStream$.on('finish', () => console.log('write end'));

            compressReadStream$.on('data', chunk => {
                console.log('received chunk');                                                                                                                                                                                                      
                const compressed = [].map.call(chunk, b => replaceTable[b]);

                const output = [];

                for (let i = 0, length = compressed.length; i < length; i += 1) {
                    for (let j = 0, l2 = compressed[i].length; j < l2; j += 1) {
                        byte = (byte << 1) | compressed[i][j];
                        currentByteBitsCount += 1;

                        if (currentByteBitsCount >= 8) {
                            output.push(byte);
                            byte = 0;
                            currentByteBitsCount = 0;
                        }
                    }
                }

                const chunkToWrite = Buffer.from(output);
                compressWriteStream$.write(chunkToWrite, () => console.log('chunk written'));
            });

            compressReadStream$.on('end', () => {
                
                if(byte) {
                    byte <<= 8 - currentByteBitsCount;
                    compressWriteStream$.write(Buffer.from([byte]), () => console.log('write last byte'));
                }

                console.log('end');

                compressWriteStream$.end();
            });
        });
}

compress('../test.txt');