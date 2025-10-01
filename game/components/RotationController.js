class RotationController extends Component {
    start() {
        this.scene = SceneManager.getActiveScene()
        this.data = this.scene.gridData
        this.game = this.scene.gameState
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
        await this.animateRotation(startPositions, shift, hexes, node)

        // Update values
        for (let i = 0; i < axials.length; i++) {
            const newIdx = (i + shift) % axials.length
            hexes[i].transform.position = startPositions[newIdx]

            const newAxial = axials[newIdx]
            this.data.addHex(newAxial.toKey(), hexes[i])
        }

        this.game.set(GameState.Phase.idle)
    }

    async animateRotation(startPositions, shift, hexes, node) {
        const center = node.transform.position

        return Engine.animation.add(new Transition({
            duration: HexGridConfig.animations.rotation,
            onUpdate: (_, t) => {
                for (let i = 0; i < hexes.length; i++) {
                    const start = startPositions[i]
                    const end = startPositions[(i + shift) % hexes.length]
                    
                    const newX = start.x + (end.x - start.x) * t
                    const newY = start.y + (end.y - start.y) * t

                    hexes[i].transform.position = new Vector2(newX, newY)
                }
            }
        }))
    }
}