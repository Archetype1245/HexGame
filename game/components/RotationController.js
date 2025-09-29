class RotationController extends Component {
    start() {
        this.data = SceneManager.getActiveScene().gridData
    }

    update() {
        // Nothing?
    }

    rotateAroundNode(node, ccw) {
        const neighbors = node.neighbors
        const rotatedNeighbors = []
        const shift = ccw ? 1 : -1 + neighbors.length
        // Get rotated neighbor positions
        for (let i = 0; i < neighbors.length; i++) {
            rotatedNeighbors[i] = neighbors[(i + shift) % neighbors.length]
        }

        // Update which hex is stored in which cell (this.data.axialInfo)
        // Get hex controllers from their original positions/cells
        const cellContentsOrig = []
        for (const cell of neighbors) {
            const hex = this.data.getHex(cell.toKey())
            cellContentsOrig.push(hex)
        }

        node.neighbors = rotatedNeighbors
        
        for (let i = 0; i < neighbors.length; i++) {
            const key = rotatedNeighbors[i].toKey()
            const hex = cellContentsOrig[i]
            this.data.addHex(key, hex)
        }

    }
}