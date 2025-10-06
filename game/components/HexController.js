class HexController extends Component {
    type = null
    color = null
    cell = null

    start() {
        this.type = Config.types.basic                           // TODO (placeholder)
    }

    setPosition(cell) {
        this.cell = cell
    }

    convertToStar() {
        this.type = Config.types.star
        this.color = "white"
        this.gameObject.getComponent(Polygon).fillStyle = this.color
    }
}