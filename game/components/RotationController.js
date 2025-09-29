class RotationController extends Component {
    start() {
        this.data = SceneManager.getActiveScene().gridData
    }

    update() {

    }

    draw() {

    }

    rotateAroundNode(node, ccw) {
        if (ccw) console.log(`Rotate ccw`)
        if (!ccw) console.log(`Rotate cw`)
    }
}