class HexController extends Component {
    start() {
        this.type = Config.types.basic                           // TODO (placeholder)
        this.layout = GameObject.getObjectByName("HexGridGameObject").getComponent(LayoutController)
    }

    setPosition(cell) {
        this.cell = cell
    }

    convertToStar() {
        this.color = Config.starColor
        this.type = Config.types.star

        const updates = {
            fillStyle: this.color,
            points: this.layout.starVertexOffsets
        }
        const pFill = this.gameObject.getComponents(Polygon).find(p => p.name === "Fill Polygon")
        Object.assign(pFill, updates)


        this.updateStarOutline()
    }

    updateStarOutline() {
        const neighbors = this.cell.getValidNeighbors()
        const vertices = []
        if (neighbors.length == 6) {
            for (let i = 0; i < 6; i++) {
                for (let v = i; v < (i + 3); v++) {
                    vertices.push(this.layout.hexVertexOffsets[v])
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
        this.pOutline = this.gameObject.addComponent(new Polygon(), settings)
    }

    toggleVisibility(on) {
        this.pOutline.hidden = !on
    }
}