class GridController extends Component {
    start() {
        this.totalColumns = HexGridConfig.grid.columns
        this.totalRows = HexGridConfig.grid.rows

        this.layout = this.gameObject.getComponent("LayoutController")
        this.hexSpawner = this.gameObject.getComponent("HexSpawnController")

        this.axialInfo = new Map()
        this.generateGrid()
    }

    update() {

    }

    draw() {

    }

    generateGrid() {
        for (let col = 0; col < this.totalColumns; col++) {
            for (let row = 0; row < this.totalRows; row++) {
                const axialCoord = HexMath.offsetToAxial(col, row)
                const pos = this.layout.getHexCenter(col, row)
                const hex = this.hexSpawner.spawnHex(pos, axialCoord, this.layout)

                this.axialInfo.set(axialCoord.toKey(), {
                    hex: hex
                })
            }
        }
        // for (const [key, value] of this.axialInfo) { console.log(key, value) }
    }
}