class NodeGameObject extends GameObject {
    constructor() {
        super("NodeGameObject");
        this.addComponent(new NodeController())
    }
}