class GameScene extends Scene{
    constructor(){
        super()
        this.gridData = new GridData()
        this.gameState = new GameState()
        this.layerOrder = ["background", "grid", "nodes", "rotation", "ui", "debug"]
        this.initLayers()
        Scene.instantiate(new HexGridGameObject(), { scene: this })
        Scene.instantiate(new DebugVisualGameObject(), { scene: this, layer: "debug" })
    }
}