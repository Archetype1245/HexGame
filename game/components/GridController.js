class GridController extends Component {
    start() {
        this.totalColumns = HexGridConfig.grid.columns
        this.totalRows = HexGridConfig.grid.rows

        this.layout = this.gameObject.getComponent(LayoutController)
        this.hexSpawner = this.gameObject.getComponent(HexSpawnController)
        this.nodeSpawner = this.gameObject.getComponent(NodeSpawnController)
        this.rotationManager = this.gameObject.getComponent(RotationController)
        this.data = SceneManager.getActiveScene().gridData

        this.selectedNode = null

        this.generateGrid()
        this.generateNodes()
    }

    update() {
        this.updateCurrentNode()

        if (Input.mouseJustReleased) {
            if (Input.consumeClick("left")) {
                if (this.selectedNode instanceof NodeController)
                    this.rotationManager.rotateAroundNode(this.selectedNode, /*ccw=*/true)
                // TODO: Add ccw rotation call for star hexes
            }
            if (Input.consumeClick("right")) {
                if (this.selectedNode instanceof NodeController)
                    this.rotationManager.rotateAroundNode(this.selectedNode, /*ccw=*/false)
                // TODO: Add cw rotation call for star hexes
            }
        }
    }

    draw() {

    }

    generateGrid() {
        for (let q = 0; q < this.totalColumns; q++) {
            let row = HexMath.rMinForGivenQ(q)
            for (let r = row; r < row + this.totalRows; r++) {
                const axial = new HexCoordinates(q, r)
                const pos = this.layout.getHexCenter(axial)
                const hex = this.hexSpawner.spawnHex(pos, axial, /*initial=*/true)

                // This is here simply to ensure the spawner doesn't need to know more than it has to (layout)
                hex.gameObject.getComponent(Polygon).points = this.layout.hexVertexOffsets
                this.data.addHex(HexCoordinates.getKeyFrom(axial), hex)
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
                    const n1Coords = HexMath.getNeighbor(hexCoords, HexMath.mod(vertex - 1, 6))
                    const n2Coords = HexMath.getNeighbor(hexCoords, vertex)

                    const nodePos = HexMath.getCentroid(this.layout.getHexCenter(hexCoords),
                        this.layout.getHexCenter(n1Coords),
                        this.layout.getHexCenter(n2Coords))

                    const node = this.nodeSpawner.spawnNode(nodePos)
                    node.neighbors = [hexCoords, n1Coords, n2Coords]
                    node.neighbors.sort(HexCoordinates.compareCoords)

                    this.data.addNode(HexCoordinates.getKeyFrom(node.neighbors), node)

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

        if (previousNode) previousNode.toggleOutlineVisibility(false)
        if (this.selectedNode) this.selectedNode.toggleOutlineVisibility(true)
    }
}