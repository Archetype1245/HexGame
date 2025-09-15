class HexCoordinates {
    constructor(q, r) {
        this.q = q;
        this.r = r;
    }

    static zero = new HexCoordinates(0, 0);

    static getKeyFrom(coord) {
        return `${coord.q},${coord.r}`
    }

    toKey() {
        return `${this.q},${this.r}`
    }

    static getKeyFromOffset(col, row) {
        const axialCoord = HexMath.offsetToAxial(col, row)
        return axialCoord.toKey()
    }

    add(other) {
        return new HexCoordinates(this.q + other.q, this.r + other.r)
    }
}

window.HexCoordinates = HexCoordinates