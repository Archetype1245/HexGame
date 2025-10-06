class GridController extends Component {
    start() {
        this.scene = SceneManager.getActiveScene()
        this.totalColumns = Config.grid.columns
        this.totalRows = Config.grid.rows

        this.layout = this.gameObject.getComponent(LayoutController)
        this.hexSpawner = this.gameObject.getComponent(HexSpawnController)
        this.nodeSpawner = this.gameObject.getComponent(NodeSpawnController)
        this.rotationManager = this.gameObject.getComponent(RotationController)
        this.data = this.scene.gridData
        this.game = this.scene.gameState

        this.selectedPivot = null

        this.generateGrid()
        this.generateNodes()
        this.setPerimetersForNodes()
    }

    update() {
        if (this.game.canInteract) {
            this.updateCurrentPivot()

            if ((Input.mouseClicks.left || Input.mouseClicks.right)            // XOR
                && !(Input.mouseClicks.left && Input.mouseClicks.right)) {
                
                const cw = Input.mouseClicks.right
                if (this.selectedPivot instanceof NodeController)
                    this.rotationManager.rotateHexes(this.selectedPivot, cw)
                // TODO: Add rotation call for star hexes
            }
        }
    }

    draw() {

    }

    generateGrid() {
        for (let q = 0; q < this.totalColumns; q++) {
            let row = HexMath.rMinForGivenQ(q)
            for (let r = row; r < row + this.totalRows; r++) {
                const cell = new HexCoordinates(q, r)
                const pos = this.layout.getHexCenter(cell)
                const hex = this.hexSpawner.spawnHex(pos, cell, /*initial=*/true)

                this.data.addHex(HexCoordinates.getKeyFrom(cell), hex)
            }
        }
    }

    generateNodes() {
        for (let q = 0; q < this.totalColumns; q += 2) {
            let validVertices = (q === 0) ? [0, 5] : [0, 3, 4, 5]
            let row = HexMath.rMinForGivenQ(q)
            for (let r = row; r < row + this.totalRows - 1; r++) {
                const cell = new HexCoordinates(q, r)
                for (const vertex of validVertices) {
                    const n1Cell = cell.getNeighbor(HexMath.mod(vertex - 1, 6))
                    const n2Cell = cell.getNeighbor(vertex)
                    const cells = [cell, n1Cell, n2Cell]

                    const nodePos = HexMath.getCentroid(...cells.map(c => this.layout.getHexCenter(c)))
                    const node = this.nodeSpawner.spawnNode(nodePos)
                    node.neighbors = cells
                    // Sort neighbor cells to create a canonical key
                    const sortedNeighbors = [...node.neighbors].sort(HexCoordinates.compareCoords)
                    const nodeKey = HexCoordinates.getKeyFrom(sortedNeighbors)
                    this.data.addNode(nodeKey, node)
                    this.setNodeOutline(node, vertex)

                    // Tie node to the corresponding vertex position of each adjacent cell
                    // Used for quick lookups when determining which outline to show
                    this.storeNodeByVertex(node, cells, vertex)
                }
            }
        }
    }

    setNodeOutline(node, vertexIndex) {
        const outlineVariation = vertexIndex % 2
        node.gameObject.addComponent(new Polygon(), {
            points: this.layout.nodeOutlineOffsets[outlineVariation],
            strokeStyle: Config.visuals.nodeOutlineColor,
            lineWidth: 6,
            fill: false,
            hidden: true
        })
    }

    storeNodeByVertex(node, cells, vertex) {
        for (let i = 0; i < cells.length; i++) {
            // For the cell we start with, the node is placed at exactly the vertex we initially looked at.
            // For each of the neighbors, taking this vertex and incrementing by 2 (per neighbor) provides us
            // with precisely the vertex for that cell that overlaps with the vertex of our starting cell
            const offset = 2 * i
            const idx = (vertex + offset) % 6

            this.data.addNodeByVertex(cells[i].toKey(), idx, node)
        }
    }

    setPerimetersForNodes() {
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

    updateCurrentPivot() {
        const px = Input.mouseX
        const py = Input.mouseY
        const cell = this.layout.worldToAxial(px, py)
        const cellInfo = this.data.axialInfo.get(cell.toKey())
        const previousPivot = this.selectedPivot

        if (cellInfo) {
            const c = this.layout.getHexCenter(cell)

            const dx = px - c.x
            const dy = py - c.y

            if (cellInfo.hex && cellInfo.hex.type === Config.types.star) {
                const threshold = this.layout.radius * 0.5
                const vLength = Math.sqrt(dx*dx + dy*dy)
                if (vLength < threshold) this.selectedPivot = cellInfo.hex
            } else {
                let a = Math.atan2(dy, dx)
                a = HexMath.mod(a, 2 * Math.PI)

                const idx = Math.floor((a + Math.PI / 6) / (Math.PI / 3)) % 6
                this.selectedPivot = cellInfo.nodesByVertex[idx] ?? null
            }
        } else {
            this.selectedPivot = null
        }

        if (previousPivot) previousPivot.toggleVisibility(false)
        if (this.selectedPivot) this.selectedPivot.toggleVisibility(true)
    }
}