class GameScene extends Scene{
    constructor(){
        super()
        Scene.instantiate(new HexGridGameObject(), { scene: this })
    }
}