class HexCoordinates {
    constructor(q, r) {
        this.q = q;
        this.r = r;
    }

    static zero = new HexCoordinates(0, 0);

    static getKeyFrom(coords) {
        return coords.toString()
    }

    toString() {
        return `(${this.q},${this.r})`
    }

    static compareCoords(c1, c2) {
        return c1.q - c2.q || c1.r - c2.r
    }

    add(other) {
        return new HexCoordinates(this.q + other.q, this.r + other.r)
    }
}

window.HexCoordinates = HexCoordinates