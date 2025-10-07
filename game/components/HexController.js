class HexController extends Component {
    start() {
        this.type = Config.types.basic                           // TODO (placeholder)
        this.perimeterNodes = []
        this.perimeterCellKeys = []

        this.layout = GameObject.getObjectByName("HexGridGameObject").getComponent(LayoutController)
        this.scene = SceneManager.getActiveScene()
        this.data = this.scene.gridData
    }

    setCell(cell) {
        this.cell = cell
        if (this.type === Config.types.star) this.updateStarPerimeter()
    }

    convertToStar() {
        console.log("layout?", this.layout)
        console.log("layout.starVertexOffsets?", this.layout.starVertexOffsets)
        this.color = Config.starColor
        this.type = Config.types.star

        const updates = {
            fillStyle: this.color,
            points: this.layout.starVertexOffsets
        }
        const pFill = this.gameObject.getComponents(Polygon).find(p => p.name === "Fill Polygon")
        Object.assign(pFill, updates)

        this.createStarOutline()
        this.updateStarPerimeter()
    }

    createStarOutline() {
        const neighborCells = this.cell.getValidNeighbors()
        const vertices = []

        if (neighborCells.length == 6) {
            const neighbors = neighborCells.map(c => this.data.axialInfo.get(c.toKey())?.hex)
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 3; j++) {
                    const v = (i + j) % 6
                    const vertex = neighbors[i].transform.position
                        .plus(this.layout.hexVertexOffsets[v])
                        .minus(this.transform.position)
                    vertices.push(vertex)
                }
            }
        }

        const settings = {
            name: "Outline Polygon",
            points: vertices,
            strokeStyle: Config.visuals.nodeOutlineColor,
            lineWidth: 6,
            fill: false,
            hidden: true
        }
        // Shouldn't *need* this guard, but I had an issue with my debug function and just fixed it both here and there
        if (!this.pOutline) {
            this.pOutline = this.gameObject.addComponent(new Polygon(), settings)
        } else {
            Object.assign(this.pOutline, settings)
        }
    }

    updateStarPerimeter() {
        const neighbors = this.cell.getValidNeighbors()
        if (neighbors.length < 6) return
        
        const innerNodes = new Set(this.data.axialInfo.get(this.cell.toKey()).nodesByVertex)
        const stringNeighbors = new Set(neighbors.map(c => c.toKey()))

        let pNodes = new Set()
        let pCells = new Set()

        neighbors.forEach(n => {
            const entry = this.data.axialInfo.get(n.toKey())
            entry.nodesByVertex
                .filter(Boolean)
                .forEach(node => {
                    if (!innerNodes.has(node)) pNodes.add(node)
                })
                // need to remove actual cell
            n.getValidNeighbors()
                .map(c => c.toKey())
                .forEach(k => {
                    if (!stringNeighbors.has(k)) pCells.add(k)
                })
        })

        this.perimeterNodes = [...pNodes]
        this.perimeterCellKeys = [...pCells]
    }

    toggleVisibility(on) {
        this.pOutline.hidden = !on
        this.scene.moveGameObjectBy(this.gameObject, on ? 1 : -1)
    }
}