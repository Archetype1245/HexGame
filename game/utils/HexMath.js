class HexMath {
    static axialDirections = [
        new HexCoordinates(1, -1),
        new HexCoordinates(0, -1),
        new HexCoordinates(-1, 0),
        new HexCoordinates(-1, 1),
        new HexCoordinates(0, 1),
        new HexCoordinates(1, 0),
    ]

    static offsetToAxial(col, row) {
        const q = col
        const r = row - ((col - (col & 1)) / 2) - (col & 1)
        return new HexCoordinates(q, r)
    }

    static axialToOffset(coords) {
        const col = coords.q
        const row = coords.r + ((col - (col & 1)) / 2) + (col & 1)
        return new Vector2(col, row)
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
}

window.HexMath = HexMath;