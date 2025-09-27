class NodeController extends Component {
    neighbors = []          // Axial coordinates corresponding to the neighbor cells
    perimeterNodes = []     // NYI - Will use for targeted match detection


    start() {

    }

    update() {

    }

    draw() {

    }

    toggleOutlineVisibility(on) {
        this.gameObject.getComponent(Polygon).hidden = !on
    }
}