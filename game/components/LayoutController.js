class LayoutController extends Component {
    start(cols, rows) {
        this.totalColumns = HexGridConfig.grid.columns
        this.totalRows = HexGridConfig.grid.rows
        this.baseHexRadius = HexGridConfig.grid.hexRadius
        this.screenWidthPct = HexGridConfig.grid.screenWidthPct
        this.screenHeightPct = HexGridConfig.grid.screenHeightPct

        this.scale = 1
        this.offsetX = 0
        this.offsetY = 0

        this.radius = 0
        this.hexW = 0
        this.hexH = 0
        this.hSpacing = 0
        this.vSpacing = 0

        this.hexVertexOffsets = []
        for (let i = 0; i < 6; i++) this.hexVertexOffsets[i] = Vector2.zero

        this.canvas = document.querySelector("#canv")
        this.lastW = 0
        this.lastH = 0

        this.computeLayout()
        this.updateHexVertexOffsets()
    }

    update() {
        if (this.canvas.width !== this.lastW || this.canvas.height !== this.lastH) {
            this.computeLayout()
            this.updateHexVertexOffsets()
            this.updateHexCenters()
        }
    }

    draw() {

    }

    computeLayout() {
        const canvasWidth = window.innerWidth
        const canvasHeight = window.innerHeight

        const r = this.baseHexRadius
        const hexW = 2 * r
        const hexH = Math.sqrt(3) * r
        const hSpacing = 0.75 * hexW
        const vSpacing = hexH

        const baseGridWidth = (this.totalColumns - 1) * hSpacing + hexW
        const baseGridHeight = (this.totalRows - 1) * vSpacing + vSpacing * 0.5

        const targetW = canvasWidth * this.screenWidthPct
        const targetH = canvasHeight * this.screenHeightPct

        this.scale = Math.min(targetW / baseGridWidth, targetH / baseGridHeight)

        this.radius = r * this.scale
        this.hexW = hexW * this.scale
        this.hexH = hexH * this.scale
        this.hSpacing = hSpacing * this.scale
        this.vSpacing = vSpacing * this.scale

        const gridW = baseGridWidth * this.scale
        const gridH = baseGridHeight * this.scale

        this.offsetX = Math.floor((this.canvas.width - gridW) / 2)
        this.offsetY = Math.floor((this.canvas.height - gridH) / 2)

        this.lastW = this.canvas.width
        this.lastH = this.canvas.height
    }

    getHexCenter(col, row) {
        const cx = this.offsetX + (this.hexW / 2) + col * this.hSpacing
        const cy = this.offsetY + (this.hexH / 2) + row * this.vSpacing + (col % 2 ? this.vSpacing * 0.5 : 0)
        return new Vector2(cx, cy)
    }

    updateHexVertexOffsets() {
        for (let i = 0; i < 6; i++) {
            const angle = i * (Math.PI / 3)
            this.hexVertexOffsets[i].x = this.radius * Math.cos(angle)
            this.hexVertexOffsets[i].y = this.radius * Math.sin(angle)
        }
    }

    updateHexCenters() {
        const grid = this.gameObject.getComponent("GridController")

        for (let col = 0; col < this.totalColumns; col++) {
            for (let row = 0; row < this.totalRows; row++) {
                const key = HexCoordinates.getKeyFromOffset(col, row)
                const cell = grid.axialInfo.get(key)
                cell.hex.transform.position = this.getHexCenter(col, row)
            }
        }
    }
}