class DebugVisualGameObject extends GameObject {
    constructor(){
        super("DebugVisualGameObject")
        this.addComponent(new DebugController())
    }
}