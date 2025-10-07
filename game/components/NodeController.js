class NodeController extends Component {
    type = Config.types.node
    neighbors = []     // Axial coordinates corresponding to the neighbor cells
    perimeterNodes = []
    perimeterCellKeys = []

    start() {

    }

    setPerimetersNodes() {
        for (const node of this.data.nodeInfo.values()) {
            let pNodes = new Set()
            let pCells = new Set()
            let stringNeighbors = new Set()

            for (const cell of node.neighbors) {
                const nodes = this.data.axialInfo.get(cell.toKey()).nodesByVertex
                nodes.forEach(n => pNodes.add(n))

                // Grab the cell-neighbors (only if they have hex GOs)
                const neighbors = cell.getValidNeighbors()
                    .forEach(c => pCells.add(c.toKey()))
                stringNeighbors.add(cell.toString())
            }
            // Remove current node and immediate cell-neighbors from perimeter list, then store
            pNodes.delete(node)
            node.perimeterNodes = [...pNodes]
            node.perimeterCellKeys = [...pCells].filter(c => !stringNeighbors.has(c))
        }
    }

    toggleVisibility(on) {
        this.gameObject.getComponent(Polygon).hidden = !on
        this.gameObject.getComponent(Circle).hidden = !on
    }
}