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

        this.nodeOutlineOffsets = [[],[]]


        // Cache previous canvas dimensions
        this.lastW = 0
        this.lastH = 0

        this.computeLayout()
        this.updateHexVertexOffsets()
        this.calcNodeOutlineVertices()
        console.log(this.nodeOutlineOffsets)
    }

    update() {
        // TODO: None of this is necessary once camera is implemented.
        // TODO: Replace this logic with camera scaling as needed.
        if (Engine.canvas.width !== this.lastW || Engine.canvas.height !== this.lastH) {
            this.computeLayout()
            this.updateHexVertexOffsets()
            this.updateHexCenters()
            // Skipping node positioning updates - waiting for camera implementation
        }
    }

    draw() {

    }

    computeLayout() {
        const r = this.baseHexRadius
        const hexW = 2 * r
        const hexH = Math.sqrt(3) * r
        const hSpacing = 0.75 * hexW
        const vSpacing = hexH

        const baseGridWidth = (this.totalColumns - 1) * hSpacing + hexW
        const baseGridHeight = (this.totalRows - 1) * vSpacing + vSpacing * 0.5

        const targetW = Engine.canvas.width * this.screenWidthPct
        const targetH = Engine.canvas.height * this.screenHeightPct

        this.scale = Math.min(targetW / baseGridWidth, targetH / baseGridHeight)

        this.radius = r * this.scale
        this.hexW = hexW * this.scale
        this.hexH = hexH * this.scale
        this.hSpacing = hSpacing * this.scale
        this.vSpacing = vSpacing * this.scale

        const gridW = baseGridWidth * this.scale
        const gridH = baseGridHeight * this.scale

        this.offsetX = Math.floor((Engine.canvas.width - gridW) / 2)
        this.offsetY = Math.floor((Engine.canvas.height - gridH) / 2)

        this.lastW = Engine.canvas.width
        this.lastH = Engine.canvas.height
    }

    getHexCenter(col, row) {
        const cx = this.offsetX + (this.hexW / 2) + col * this.hSpacing
        const cy = this.offsetY + (this.hexH / 2) + row * this.vSpacing + (col % 2 ? this.vSpacing * 0.5 : 0)
        return new Vector2(cx, cy)
    }

    // TODO: Can probably rename to `calcHexVertexOffsets` after camera is added
    updateHexVertexOffsets() {
        for (let i = 0; i < 6; i++) {
            const angle = i * (Math.PI / 3)
            this.hexVertexOffsets[i].x = this.radius * Math.cos(angle)
            this.hexVertexOffsets[i].y = this.radius * Math.sin(angle)
        }
    }

    calcNodeOutlineVertices() {
        /*
        0,  120, 240 at r = 2*r = hexW
        60, 180, 300 at r = r
        30, 90, 150, 210, 270, 330 = c
        */
        let angle = Math.PI / 3
        let r = this.radius
        const c = Math.sqrt(2 * r**2 * (1 - Math.cos(2*angle)))

        for (let i = 0; i < 12; i++) {
            const mod = i % 4
            r = (mod === 0) ? this.radius
              : (mod === 2) ? this.hexW
              : c

            for (let j of [0,1]) {
                angle = i * (Math.PI / 6) + (Math.PI * j)
                this.nodeOutlineOffsets[j][i] = new Vector2(r * Math.cos(angle), r * Math.sin(angle))
            }
        }
    }

    // TODO: Shouldn't need after camera code is added
    updateHexCenters() {
        const grid = this.gameObject.getComponent("GridController")

        for (let q = 0; q < this.totalColumns; q++) {
            let row = HexMath.rMinForGivenQ(q)
            for (let r = row; r < row + this.totalRows; r++) {
                const key = HexCoordinates.getKeyFrom(new HexCoordinates(q, r))
                const cell = grid.axialInfo.get(key)
                cell.hex.transform.position = this.getHexCenter(col, row)
            }
        }
    }
}