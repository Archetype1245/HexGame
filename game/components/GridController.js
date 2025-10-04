class GridController extends Component {
    start() {
        this.scene = SceneManager.getActiveScene()
        this.totalColumns = HexGridConfig.grid.columns
        this.totalRows = HexGridConfig.grid.rows

        this.layout = this.gameObject.getComponent(LayoutController)
        this.hexSpawner = this.gameObject.getComponent(HexSpawnController)
        this.nodeSpawner = this.gameObject.getComponent(NodeSpawnController)
        this.rotationManager = this.gameObject.getComponent(RotationController)
        this.data = this.scene.gridData
        this.game = this.scene.gameState

        this.selectedNode = null

        this.generateGrid()
        this.generateNodes()
        this.setPerimetersForNodes()
    }

    update() {
        if (this.game.canInteract) {
            this.updateCurrentNode()

            if ((Input.mouseClicks.left || Input.mouseClicks.right)            // XOR
                && !(Input.mouseClicks.left && Input.mouseClicks.right)) {
                
                const cw = Input.mouseClicks.right
                if (this.selectedNode instanceof NodeController)
                    this.rotationManager.rotateAroundNode(this.selectedNode, cw)
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
                const hexCoords = new HexCoordinates(q, r)
                for (const vertex of validVertices) {
                    const n1Coords = hexCoords.getNeighbor(HexMath.mod(vertex - 1, 6))
                    const n2Coords = hexCoords.getNeighbor(vertex)

                    const nodePos = HexMath.getCentroid(this.layout.getHexCenter(hexCoords),
                        this.layout.getHexCenter(n1Coords),
                        this.layout.getHexCenter(n2Coords))

                    const node = this.nodeSpawner.spawnNode(nodePos)
                    node.neighbors = [hexCoords, n1Coords, n2Coords]

                    const sortedNeighbors = [...node.neighbors].sort(HexCoordinates.compareCoords)

                    const nodeKey = HexCoordinates.getKeyFrom(sortedNeighbors)
                    this.data.addNode(nodeKey, node)

                    // Assign the node the appropriate outline configuration
                    this.setNodeOutline(node, vertex)
                    // TODO: Perimeter node calculation (for targeted localized match checking
                    // console.log(node.perimeterNodes)

                    // Tie node to the corresponding vertex position of each adjacent cell
                    // Used for quick lookups when determining which outline to show
                    const cells = [hexCoords, n1Coords, n2Coords]
                    this.storeNodeByVertex(node, cells, vertex)
                }
            }
        }
    }

    setNodeOutline(node, vertexIndex) {
        const outlineVariation = vertexIndex % 2
        node.gameObject.addComponent(new Polygon(), {
            points: this.layout.nodeOutlineOffsets[outlineVariation],
            strokeStyle: HexGridConfig.visuals.nodeOutlineColor,
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
                // const neighbors = HexMath.getAllNeighbors(cell).filter(c => this.data.getHex(c.toKey()))
                const neighbors = cell.getAllNeighbors().filter(c => this.data.getHex(c.toKey()))
                neighbors.forEach(c => pCells.add(c.toKey()))
                stringNeighbors.add(cell.toString())
            }
            pNodes.delete(node)                                        // Remove current node from perimeter list
            node.perimeterNodes = [...pNodes]

            pCells = [...pCells].filter(c => !stringNeighbors.has(c))  // Remove immediate neighbors from perimeter
            node.perimeterCells = pCells.map(c => HexCoordinates.fromString(c))
        }
    }

    updateCurrentNode() {
        const px = Input.mouseX
        const py = Input.mouseY
        const cell = this.layout.worldToAxial(px, py)
        let cellInfo = this.data.axialInfo.get(cell.toKey())
        const previousNode = this.selectedNode

        if (cellInfo) {
            const c = this.layout.getHexCenter(cell)

            const dx = px - c.x
            const dy = py - c.y

            let a = Math.atan2(dy, dx)
            a = HexMath.mod(a, 2 * Math.PI)

            const idx = Math.floor((a + Math.PI / 6) / (Math.PI / 3)) % 6
            this.selectedNode = cellInfo.nodesByVertex[idx] ?? null
        } else {
            this.selectedNode = null
        }

        if (previousNode) previousNode.toggleVisibility(false)
        if (this.selectedNode) this.selectedNode.toggleVisibility(true)
    }
}