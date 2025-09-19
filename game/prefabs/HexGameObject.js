class HexGameObject extends GameObject {
    constructor() {
        super("HexGameObject");
        this.addComponent(new HexController())
    }
}