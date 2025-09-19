class HexGridGameObject extends GameObject{
    constructor(){
        super("HexGridGameObject")
        this.addComponent(new LayoutController())
        this.addComponent(new GridController())
        this.addComponent(new HexSpawnController())
        this.addComponent(new NodeSpawnController())
        this.addComponent(new MatchController())
    }
}