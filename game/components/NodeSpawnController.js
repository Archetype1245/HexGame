class NodeSpawnController extends Component {
    start() {

    }

    update() {

    }

    draw() {

    }

    spawnNode(position) {
        const nodeObject = new NodeGameObject()
        const node = nodeObject.getComponent(NodeController)

        Scene.instantiate(nodeObject, { position: position, layer: 1 })

        node.gameObject.addComponent(new Circle(), {
            r: HexGridConfig.visuals.nodeRadius,
            fillStyle: HexGridConfig.visuals.nodeColor,
            hidden: true
        })
        return node
    }
}