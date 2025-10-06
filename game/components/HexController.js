class HexController extends Component {
    type = null
    color = null
    cell = null

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

        const settings = {
            name: "Outline Polygon",
            points: [new Vector2(0,0), new Vector2(500, 500)],
            strokeStyle: Config.visuals.nodeOutlineColor,
            lineWidth: 6,
            fill: false,
            hidden: true
        }

        const p = this.gameObject.getComponents(Polygon).find(p => p.name === "Fill Polygon")
        Object.assign(p, updates)
        this.gameObject.addComponent(new Polygon(), settings)
    }

    toggleVisibility() {

    }
}