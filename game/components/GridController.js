class GridController extends Component {
    start() {
        this.totalColumns = HexGridConfig.grid.columns
        this.totalRows = HexGridConfig.grid.rows

        this.layout = this.gameObject.getComponent("LayoutController")
        this.hexSpawner = this.gameObject.getComponent("HexSpawnController")
        this.nodeSpawner = this.gameObject.getComponent("NodeSpawnController")

        this.axialInfo = new Map()
        this.nodeInfo = new Map()
        this.generateGrid()
        this.generateNodes()

        // Testing
        // Ideally, on some input, detect the Node clicked (or whatever) and set its polygon.hidden to false
        // const key = "(5,0),(6,-1),(6,0)"
        const key = "(4,1),(4,2),(5,1)"
        const node = this.nodeInfo.get(key)
        node.gameObject.getComponent("Polygon").hidden = false
    }

    update() {

    }

    draw() {

    }

    generateGrid() {
        for (let q = 0; q < this.totalColumns; q++) {
            let row = HexMath.rMinForGivenQ(q)
            for (let r = row; r < row + this.totalRows; r++) {
                const axial = new HexCoordinates(q, r)
                const pos = this.layout.getHexCenter(axial)
                const hex = this.hexSpawner.spawnHex(pos)

                // This is here simply to ensure the spawner doesn't need to know more than it has to (ex: layout)
                hex.gameObject.addComponent(new Polygon(), {
                    points: this.layout.hexVertexOffsets,
                    lineWidth: HexGridConfig.visuals.hexOutlinePx,
                    strokeStyle: HexGridConfig.visuals.hexOutlineColor,
                    fillStyle: hex.color
                })

                this.axialInfo.set(HexCoordinates.getKeyFrom(axial), {
                    hex: hex
                })
            }
        }

        // DEBUG VISUAL ONLY
        let overlay = new GameObject("DebugVisualGameObject")
        overlay.addComponent(new DebugOverlayController(), { model: this, layout: this.layout })
        Scene.instantiate(overlay, { layer: 100 })
    }

    generateNodes() {
        for (let q = 0; q < this.totalColumns; q += 2) {
            let validVertices = (q === 0) ? [0, 5] : [0, 3, 4, 5]
            let row = HexMath.rMinForGivenQ(q)
            for (let r = row; r < row + this.totalRows - 1; r++) {
                const hexCoords = new HexCoordinates(q, r)
                for (const vertex of validVertices) {
                    const n1Coords = HexMath.getNeighbor(hexCoords, vertex)
                    const n2Coords = HexMath.getNeighbor(hexCoords, HexMath.mod(vertex - 1, 6))

                    const nodePos = HexMath.getCentroid(this.layout.getHexCenter(hexCoords),
                        this.layout.getHexCenter(n1Coords),
                        this.layout.getHexCenter(n2Coords))

                    const node = this.nodeSpawner.spawnNode(nodePos)

                    // This is here simply to ensure the spawner doesn't need to know more than it has to (ex: layout)
                    const outlineVariation = vertex % 2
                    node.gameObject.addComponent(new Polygon(), {
                        points: this.layout.nodeOutlineOffsets[outlineVariation],
                        strokeStyle: HexGridConfig.visuals.nodeOutlineColor,
                        lineWidth: 6,
                        fill: false,
                        hidden: true
                    })

                    node.neighbors = [hexCoords, n1Coords, n2Coords]
                    node.neighbors.sort(HexCoordinates.compareCoords)
                    this.nodeInfo.set(HexCoordinates.getKeyFrom(node.neighbors), node)
                }
            }
        }
    }
}