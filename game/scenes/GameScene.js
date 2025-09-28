class GameScene extends Scene{
    constructor(){
        super()
        Scene.instantiate(new HexGridGameObject(), { scene: this })
        Scene.instantiate(new DebugVisualGameObject(), { scene: this, layer: 100 })
    }
}