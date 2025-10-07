class RotationController extends Component {
    start() {
        this.scene = SceneManager.getActiveScene()
        this.data = this.scene.gridData
        this.game = this.scene.gameState
        this.matcher = this.gameObject.getComponent(MatchController)
    }

    async rotateHexes(pivot, cw) {
        this.game.set(GameState.Phase.rotating)

        let cells = []
        let numRotations = 1
        let totalAngle = cw ? 1 : -1
        const matchScope = { nodes: pivot.perimeterNodes, keys: pivot.perimeterCellKeys }

        switch (pivot.type) {
            case Config.types.node:
                cells = pivot.neighbors
                numRotations = 3
                totalAngle *= (2 * Math.PI / 3)                 // +- 120 degrees, depending on rotation direction
                break

            case Config.types.star:
                cells = pivot.cell.getValidNeighbors()
                totalAngle *= (Math.PI / 3)                     // +- 60 degrees, depending on rotation direction
                break

            default:
                break
        }

        const shift = cw ? 1 : cells.length - 1

        // Start cycle
        for (let i = 0; i < numRotations; i++) {
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
            await this.animateRotation(hexes, pivot, totalAngle)

            // Update values
            for (let i = 0; i < cells.length; i++) {
                const newIdx = (i + shift) % cells.length
                hexes[i].transform.position = startPositions[newIdx]

                const newCell = cells[newIdx]
                hexes[i].setCell(newCell)
                this.data.addHex(newCell.toKey(), hexes[i])

            }
            // No need to check final rotation for matches, but always check star rotation
            if (pivot.type === Config.types.star || i < numRotations - 1) {
                const matches = this.matcher.checkForMatches(matchScope)
                if (matches.size === 0) continue                    // No matches, continue rotating

                // If matches had elements...
                pivot.toggleVisibility(false)
                this.matcher.processMatches(matches)
                return
            }
        }
        this.game.set(GameState.Phase.idle)                         // Rotation Completed with no matches found
    }

    async animateRotation(hexes, pivot, angle) {
        for (const hex of hexes) {
            hex.transform.setParent(pivot.transform)
            this.scene.moveGameObjectUp(hex.gameObject)             // Shift rotating objs up a draw layer
        }
        this.scene.moveGameObjectUp(pivot.gameObject)

        await Engine.animation.add(new Transition({
            from: pivot.transform.rotation,
            to: pivot.transform.rotation + angle,
            duration: Config.animations.rotation,
            onUpdate: (angle) => pivot.transform.rotation = angle
        }))

        for (const hex of hexes) {
            hex.transform.setParent(null)
            this.scene.moveGameObjectDown(hex.gameObject)           // Shift objs back down to orig layer
        }
        this.scene.moveGameObjectDown(pivot.gameObject)
    }
}