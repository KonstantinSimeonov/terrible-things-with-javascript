'use strict';

function hanoi(source, middle, destination, disks) {

    if (disks === 1) {
        return console.log(`Moving disk 1 from ${source} to ${destination}`);
    }

    hanoi(source, destination, middle, disks - 1);
    console.log(`Moving ${disks} from ${source} to ${destination}`);
    hanoi(middle, source, destination, disks - 1);
}

const solveHanoi = hanoi.bind(null, 'A', 'B', 'C');

solveHanoi(4);