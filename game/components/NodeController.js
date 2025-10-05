class NodeController extends Component {
    neighbors = []     // Axial coordinates corresponding to the neighbor cells
    perimeterNodes = []
    perimeterCellKeys = []

    start() {

    }

    update() {

    }

    draw() {

    }

    toggleVisibility(on) {
        this.gameObject.getComponent(Polygon).hidden = !on
        this.gameObject.getComponent(Circle).hidden = !on
    }
}