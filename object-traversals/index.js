'use strict';

function o_dfs(obj, cb, path = []) {
    cb(obj, path);

    if(Object.prototype.toString.call(obj) !== '[object Object]' && !Array.isArray(obj)) {
        return;
    }

    for(const key in obj) {
        path.push(key);
        o_dfs(obj[key], cb, path);
        path.pop(key);
    }
}

const heresAnObject = {
    name: 'goshko',
    marks: [2, 2, 2, 3, 2, 2, 3, 2],
    friends: [{ name: 'Mariika' }, { name: 'Gerginka', age: 17 }],
    specialSkill: {
        title: 'eating',
        level: 'over 9000',
        synergyWith: ['sleeping', 'getting fat']
    },
    isStudent: true
};

o_dfs(heresAnObject, console.log);