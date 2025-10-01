class GameScene extends Scene{
    constructor(){
        super()
        this.gridData = new GridData()
        this.gameState = new GameState()
        Scene.instantiate(new HexGridGameObject(), { scene: this })
        Scene.instantiate(new DebugVisualGameObject(), { scene: this, layer: 100 })
    }
}