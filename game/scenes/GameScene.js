class GameScene extends Scene{
    constructor(){
        super()
        //Game-specific code
        Scene.instantiate(new HexGridGameObject(), { scene: this })
    }
}