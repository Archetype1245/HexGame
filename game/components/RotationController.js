class RotationController extends Component {
    start() {
        this.scene = SceneManager.getActiveScene()
        this.data = this.scene.gridData
        this.game = this.scene.gameState
        this.matcher = this.gameObject.getComponent(MatchController)
    }

    update() {
        // Nothing?
    }

    async rotateAroundNode(node, cw) {
        this.game.set(GameState.Phase.rotating)
        // Grab initial values
        const axials = node.neighbors
        const startPositions = []
        const hexes = []
        const shift = cw ? 1 : axials.length - 1

        for (let i = 0; i < axials.length; i++) {
            const key = axials[i].toKey()
            const hex = this.data.getHex(key)
            const pos = hex.transform.position

            hexes.push(hex)
            startPositions.push(pos.clone())
        }

        // Animation
        await this.animateRotation(hexes, node, cw)

        // Update values
        for (let i = 0; i < axials.length; i++) {
            const newIdx = (i + shift) % axials.length
            hexes[i].transform.position = startPositions[newIdx]

            const newAxial = axials[newIdx]
            this.data.addHex(newAxial.toKey(), hexes[i])
        }

        this.matcher.checkForMatches(node)

        this.game.set(GameState.Phase.idle)
    }

    async animateRotation(hexes, node, cw) {
        for (const hex of hexes) {
            hex.transform.setParent(node.transform)
        }
        const totalAngle = (cw ? 1 : -1) * (2 * Math.PI / 3)        // +- 120 degrees, depending on rotation direction

        await Engine.animation.add(new Transition({
            from: node.transform.rotation,
            to: node.transform.rotation + totalAngle,
            duration: HexGridConfig.animations.rotation,
            onUpdate: (angle) => node.transform.rotation = angle
        }))

        for (const hex of hexes) {
            hex.transform.setParent(null)
        }
    }
}