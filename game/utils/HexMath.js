class HexMath {
    static axialDirections = [
        new HexCoordinates(1, -1),
        new HexCoordinates(0, -1),
        new HexCoordinates(-1, 0),
        new HexCoordinates(-1, 1),
        new HexCoordinates(0, 1),
        new HexCoordinates(1, 0),
    ]

    static Direction = {
        Southeast: 0,
        South:     1,
        Southwest: 2,
        Northwest: 3,
        North:     4,
        Northeast: 5
    }

    static rMinForGivenQ(q) {
        return -((q + (q & 1)) / 2) || 0
    }

    static rToOffset(q, r) {
        return r + q - Math.floor(q / 2)
    }

    static getNeighbor(axial, dirIndex) {
        const dirOffset = HexMath.axialDirections[dirIndex % 6]
        return axial.add(dirOffset)
    }

    static getAllNeighbors(axial) {
        const neighbors = []
        for (let i = 0; i < 6; i++) {
            neighbors[i] = HexMath.getNeighbor(axial, i)
        }
        return neighbors
    }

    static getCentroid(h1, h2, h3) {
        return h1.plus(h2).plus(h3).times(1 / 3)
    }

    // I guess the `%` operator in JS is remainder, not modulus. Helper to calc mod.
    static mod(n, m) {
        return ((n % m) + m) % m
    }
}

window.HexMath = HexMath;