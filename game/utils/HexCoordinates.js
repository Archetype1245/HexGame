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

    static fromString(str) {
        const match = str.match(/^\((-?\d+),\s*(-?\d+)\)$/)
        // Should realistically throw an error here if no match is found
        return new HexCoordinates(parseInt(match[1], 10), parseInt(match[2], 10))
    }

    toKey() {
        return `(${this.q},${this.r})`
    }

    getNeighbor(dirIndex) {
        const dirOffset = HexMath.axialDirections[dirIndex % 6]
        return this.add(dirOffset)
    }

    getAllNeighbors() {
        const neighbors = []
        for (let i = 0; i < 6; i++) {
            neighbors[i] = this.getNeighbor(i)
        }
        return neighbors
    }

    getValidNeighbors() {
        // Get all neighbors for a cell and filter out any cells that fall outside the defined grid bounds
        return this.getAllNeighbors().filter(c => {
            const rMin = HexMath.rMinForGivenQ(c.q)
            const rMax = HexMath.rMaxForGivenQ(c.q)
            return c.q >= 0 && c.q < Config.grid.columns && c.r >= rMin && c.r <= rMax
        })
    }

    static compareCoords(c1, c2) {
        return c1.q - c2.q || c1.r - c2.r
    }

    add(other) {
        return new HexCoordinates(this.q + other.q, this.r + other.r)
    }
}

window.HexCoordinates = HexCoordinates