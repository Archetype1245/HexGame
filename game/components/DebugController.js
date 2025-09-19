class DebugController extends Component {
    matchTestRunning = false

    update() {
        if (Input.keysDown.includes("ShiftLeft") &&
            Input.keysDown.includes("KeyT") &&
            (!this.matchTestRunning)) {
            
            DebugController.testGridMatchPrevention()
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const [key, cell] of this.model.axialInfo) {
            const hex = cell.hex;
            const pos = hex.transform.position;
            ctx.fillText(key, pos.x, pos.y);
        }

        ctx.restore();
    }

    static testGridMatchPrevention() {
        // TODO: update to include check for star-matches in addition to basic-matches
        if (this.matchTestRunning) return

        this.matchTestRunning = true
        const scene = SceneManager.getActiveScene()
        const grid = scene.gameObjects.find(go => go.name === "HexGridGameObject").getComponent("GridController")

        for (const [key, node] of grid.nodeInfo) {
            let neighborColors = []
            for (const axial of node.neighbors) {
                neighborColors.push(grid.axialInfo.get(axial.toString()).hex.color)
            }
            if (neighborColors[0] === neighborColors[1] &&
                neighborColors[1] === neighborColors[2]) {
                console.log(`Match detected at ${node.neighbors}.`)
                return
            }
        }
        console.log(`No match detected.`)
        grid.axialInfo.clear()
        grid.nodeInfo.clear()
        scene.layerGroups.clear()
        scene.sortedLayers = []
        scene.gameObjects = []
        Scene.instantiate(new HexGridGameObject, { scene: scene})
        console.log(scene.gameObjects)

        this.matchTestRunning = false
    }
}