class RotationController extends Component {
    start() {
        this.data = SceneManager.getActiveScene().gridData
    }

    update() {
        // Nothing?
    }

    rotateAroundNode(node, cw) {
        const axials = node.neighbors
        const startPositions = []
        const hexes = []

        for (let i = 0; i < axials.length; i++) {
            const key = axials[i].toKey()
            const hex = this.data.getHex(key)
            const pos = hex.transform.position

            hexes.push(hex)
            startPositions.push(pos.clone())
            this.data.deleteHex(key)  // Shouldn't need this, actually. Keeping for now, though.
        }

        const shift = cw ? 1 : axials.length - 1
        for (let i = 0; i < axials.length; i++) {
            const newIdx = (i + shift) % axials.length
            hexes[i].transform.position = startPositions[newIdx]

            const newAxial = axials[newIdx]
            this.data.addHex(newAxial.toKey(), hexes[i])
        }
    }
}