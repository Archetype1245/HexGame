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

    static rMaxForGivenQ(q) {
        return HexGridConfig.grid.rows + HexMath.rMinForGivenQ(q) - 1
    }

    static rToOffset(q, r) {
        return r + q - Math.floor(q / 2)
    }

    static getCentroid(h1, h2, h3) {
        return h1.plus(h2).plus(h3).times(1 / 3)
    }

    static mod(n, m) {
        return ((n % m) + m) % m
    }
}

window.HexMath = HexMath;