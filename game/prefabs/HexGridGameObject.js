class HexGridGameObject extends GameObject{
    constructor(){
        super("HexGridGameObject")
        this.addComponent(new LayoutController())
        this.addComponent(new HexSpawnController())
        this.addComponent(new MatchController())
        this.addComponent(new GridController())
        this.addComponent(new NodeSpawnController())
        this.addComponent(new RotationController())
        this.addComponent(new MatchController())
    }
}