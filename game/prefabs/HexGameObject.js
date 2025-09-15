class HexGameObject extends GameObject {
    constructor(axial) {
        super("HexGameObject");
        this.addComponent(new HexStateController(axial))
    }
}