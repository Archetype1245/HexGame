class HexController extends Component {
    type = null
    color = null

    start() {
        const colors = Object.values(HexGridConfig.hexColors)           // TODO (placeholder)
        this.type = HexGridConfig.types.basic                           // TODO (placeholder)
        this.color = colors[Math.floor(Math.random() * colors.length)]  // TODO (placeholder)
    }

    update() {

    }

    draw() {

    }
}