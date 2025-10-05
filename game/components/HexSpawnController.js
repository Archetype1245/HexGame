class HexSpawnController extends Component {
    start() {
        this.layout = this.gameObject.getComponent(LayoutController)
    }

    update() {

    }

    draw() {

    }

    spawnHex(position, cell, initial=false) {
        const hexObject = new HexGameObject()
        const hex = hexObject.getComponent(HexController)

        Scene.instantiate(hexObject, { position: position, layer: "grid" })

        const colors = initial && cell ? this.getValidColors(cell) : Object.values(Config.hexColors)
        const idx = Math.floor(Math.random() * colors.length)
        hex.color = colors[idx]
        hex.cell = cell

        hex.gameObject.addComponent(new Polygon(), {
            points: this.layout.hexVertexOffsets,
            lineWidth: Config.visuals.hexOutlinePx,
            strokeStyle: Config.visuals.hexOutlineColor,
            fillStyle: hex.color
        })
        return hex
    }

    getValidColors(axial) {
        if (!axial) return "magenta"  // Shouldn't happen

        const data = SceneManager.getActiveScene().gridData
        // Need to check South+Southwest and Southwest+Northwest wedges (colors of the hexes there)
        // And remove colors from the pool if it would create a match in the initial grid generation
        // TODO: Add star-hex match detection
        let invalidColors = []

        // const d1 = HexMath.Direction.South
        // const d2 = HexMath.Direction.Southwest
        // const d3 = HexMath.Direction.Northwest

        const dirs = [HexMath.Direction.South, HexMath.Direction.Southwest, HexMath.Direction.Northwest]

        for (let i = 0; i < dirs.length - 1; i++) {
            const n1Axial = axial.getNeighbor(dirs[i]).toString()
            const n2Axial = axial.getNeighbor(dirs[i + 1]).toString()

            const n1 = data.axialInfo.get(n1Axial)?.hex ?? null
            const n2 = data.axialInfo.get(n2Axial)?.hex ?? null

            if (n1 && n2 && n1.color === n2.color) {
                invalidColors.push(n1.color)
                break
            }
        }

        return Object.values(Config.hexColors).filter(c => (!invalidColors.includes(c)))
    }
}