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

        const cells = node.neighbors
        const shift = cw ? 1 : cells.length - 1

        // Start cycle
        for (let i = 0; i < Config.animations.totalNodeRotations; i++) {
            const startPositions = []
            const hexes = []
            for (let i = 0; i < cells.length; i++) {
                const key = cells[i].toKey()
                const hex = this.data.getHex(key)
                if (!hex) { this.game.set(GameState.Phase.idle); return }    // Don't try to rotate if any hexes are missing

                hexes.push(hex)
                const pos = hex.transform.position
                startPositions.push(pos.clone())

            }

            // Animation
            await this.animateRotation(hexes, node, cw)

            // Update values
            for (let i = 0; i < cells.length; i++) {
                const newIdx = (i + shift) % cells.length
                hexes[i].transform.position = startPositions[newIdx]

                const newAxial = cells[newIdx]
                hexes[i].cell = newAxial
                this.data.addHex(newAxial.toKey(), hexes[i])

            }

            if (i < Config.animations.totalNodeRotations - 1) {     // No need to check final rotation for matches
                const matchScope = { nodes: node.perimeterNodes, keys: node.perimeterCellKeys }
                const matches = this.matcher.checkForMatches(matchScope)
                if (matches.size === 0) continue                    // No matches, continue rotating

                // If matches had elements...
                node.toggleVisibility(false)
                await this.matcher.processMatches(matches)
                return
            }
        }
        this.game.set(GameState.Phase.idle)                         // Rotation Completed with no matches found
    }

    async animateRotation(hexes, node, cw) {
        for (const hex of hexes) {
            hex.transform.setParent(node.transform)
            this.scene.moveGameObjectUp(hex.gameObject)             // Shift rotating objs up a draw layer
        }
        this.scene.moveGameObjectUp(node.gameObject)
        const totalAngle = (cw ? 1 : -1) * (2 * Math.PI / 3)        // +- 120 degrees, depending on rotation direction

        await Engine.animation.add(new Transition({
            from: node.transform.rotation,
            to: node.transform.rotation + totalAngle,
            duration: Config.animations.rotation,
            onUpdate: (angle) => node.transform.rotation = angle
        }))

        for (const hex of hexes) {
            hex.transform.setParent(null)
            this.scene.moveGameObjectDown(hex.gameObject)           // Shift objs back down to orig layer
        }
        this.scene.moveGameObjectDown(node.gameObject)
    }
}