class GameScene extends Scene{
    constructor(){
        super()
        //Game-specific code
        this.instantiate(new HexGridGameObject("HexGridGameObject"))
    }
}