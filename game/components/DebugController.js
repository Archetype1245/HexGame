class DebugController extends Component {
    static matchTestRunning = false
    static remainingRuns = 0

    update() {
        if (Input.keyHeld("ShiftLeft") && Input.keyPressed("KeyT")) {
            if (!DebugController.matchTestRunning) {
                DebugController.remainingRuns = 100
                DebugController.matchTestRunning = true
            }
        }
        if (DebugController.remainingRuns > 0) {
                DebugController.testGridMatchPrevention()
                DebugController.remainingRuns--
        } else {
                DebugController.matchTestRunning = false
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const scene = SceneManager.getActiveScene()
        const grid = scene.gameObjects.find(go => go.name === "HexGridGameObject").getComponent(GridController)
        for (const [key, cell] of grid.axialInfo) {
            const hex = cell.hex;
            const pos = hex.transform.position;
            ctx.fillText(key, pos.x, pos.y);
        }

        ctx.restore();
    }

    static testGridMatchPrevention() {
        // TODO: update to include check for star-matches in addition to basic-matches
        const scene = SceneManager.getActiveScene()
        const grid = scene.gameObjects.find(go => go.name === "HexGridGameObject").getComponent(GridController)

        for (const [key, node] of grid.nodeInfo) {
            let neighborColors = []
            for (const axial of node.neighbors) {
                neighborColors.push(grid.axialInfo.get(axial.toString()).hex.color)
            }
            if (neighborColors[0] === neighborColors[1] &&
                neighborColors[1] === neighborColors[2]) {
                console.log(`Match detected in run ${i} at ${node.neighbors}.`)
                return
            }
        }
        console.log(`No match detected.`)
        grid.axialInfo.clear()
        grid.nodeInfo.clear()

        for (const [layer, group] of scene.layerGroups) {
            for (const go of Array.from(group)) {
                if (go.name !== "DebugVisualGameObject") {
                    group.delete(go)
                }
            }
            if (group.size === 0) {
                scene.layerGroups.delete(layer)
                scene.sortedLayers = scene.sortedLayers.filter(l => l !== layer)
            }
        }

        scene.gameObjects = scene.gameObjects.filter(go => go.name === "DebugVisualGameObject")
        Scene.instantiate(new HexGridGameObject, { scene: scene })
    }
}