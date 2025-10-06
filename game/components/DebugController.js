class DebugController extends Component {
    start() {
        this.matchTestRunning = false
        this.totalRuns = 0
        this.remainingRuns = 0
        this.scene = SceneManager.getActiveScene()
        this.data = this.scene.gridData
        this.layout = GameObject.getObjectByName("HexGridGameObject").getComponent(LayoutController)
    }

    update() {
        if (Input.keyHeld("ShiftLeft") && Input.keyPressed("KeyT")) {
            if (!this.matchTestRunning) {
                this.remainingRuns = 100
                this.matchTestRunning = true
            }
        }
        if (this.remainingRuns > 0) {
            this.totalRuns++
            this.testGridMatchPrevention()
            this.remainingRuns--
        } else {
            this.matchTestRunning = false
            this.totalRuns = 0
        }

        if (Input.keyHeld("ShiftLeft") && Input.keyPressed("KeyS")) {
            const px = Input.mouseX
            const py = Input.mouseY
            const cell = this.layout.worldToAxial(px, py)
            const hex = this.data.axialInfo.get(cell.toKey())?.hex

            if (hex) hex.convertToStar()

        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const [key, obj] of this.data.axialInfo) {
            const hex = obj.hex;
            const pos = hex?.transform.position
            if (pos) ctx.fillText(key, pos.x, pos.y);
        }

        ctx.restore();
    }

    testGridMatchPrevention() {
        // TODO: update to include check for star-matches in addition to basic-matches
        for (const [key, node] of this.data.nodeInfo) {
            let neighborColors = []
            for (const axial of node.neighbors) {
                neighborColors.push(this.data.axialInfo.get(axial.toString()).hex.color)
            }
            if (neighborColors[0] === neighborColors[1] &&
                neighborColors[1] === neighborColors[2]) {
                console.log(`Match detected in run ${this.totalRuns} at ${node.neighbors}.`)
                this.remainingRuns = 0
                return
            }
        }
        console.log(`No match detected.`)
        this.data.clear()

        this.scene.initLayers()
        this.scene.addToLayerMap(this.gameObject)

        this.scene.gameObjects = this.scene.gameObjects.filter(go => go.name === "DebugVisualGameObject")
        Scene.instantiate(new HexGridGameObject, { scene: this.scene, forceStart: true })
    }
}