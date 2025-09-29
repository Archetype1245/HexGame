class DebugController extends Component {
    start() {
        this.matchTestRunning = false
        this.remainingRuns = 0
        this.scene = SceneManager.getActiveScene()
        this.data = this.scene.gridData
    }

    update() {
        if (Input.keyHeld("ShiftLeft") && Input.keyPressed("KeyT")) {
            if (!this.matchTestRunning) {
                this.remainingRuns = 100
                this.matchTestRunning = true
            }
        }
        if (this.remainingRuns > 0) {
                this.testGridMatchPrevention()
                this.remainingRuns--
        } else {
                this.matchTestRunning = false
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const [key, cell] of this.data.axialInfo) {
            const hex = cell.hex;
            const pos = hex.transform.position;
            ctx.fillText(key, pos.x, pos.y);
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
                console.log(`Match detected in run ${i} at ${node.neighbors}.`)
                return
            }
        }
        console.log(`No match detected.`)
        this.data.clear()

        for (const [layer, group] of this.scene.layerGroups) {
            for (const go of Array.from(group)) {
                if (go.name !== "DebugVisualGameObject") {
                    group.delete(go)
                }
            }
            if (group.size === 0) {
                this.scene.layerGroups.delete(layer)
                this.scene.sortedLayers = this.scene.sortedLayers.filter(l => l !== layer)
            }
        }

        this.scene.gameObjects = this.scene.gameObjects.filter(go => go.name === "DebugVisualGameObject")
        Scene.instantiate(new HexGridGameObject, { scene: this.scene, forceStart: true})
    }
}