class RollingHash {
    constructor(mod, base, str) {
        this.mod = mod;
        this.base = base;
        this.str = str;

        this.hash = 0,
        this.power = 1;

        for(let char of str) {
            this.hash = (this.hash * this.base + char.charCodeAt(0)) % this.mod;
            this.power *= base;
        }
    }

    removeLeft(char) {
        this.hash -= this.power * char.charCodeAt(0) % this.mod;

        if(this.hash < 0) {
            this.hash += this.mod;
        }
    }

    addRight(char) {
        this.hash = this.hash * this.base + char.charCodeAt(0);
        this.hash %= this.mod;
    }

    roll(remove, add) {
        this.addRight(add);
        this.removeLeft(remove);
    }

    equals(otherHash) {
        return this.hash === otherHash.hash;
    }
}

module.exports = RollingHash;