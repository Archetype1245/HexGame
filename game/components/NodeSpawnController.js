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

        Scene.instantiate(nodeObject, { position: position, layer: "nodes" })

        node.gameObject.addComponent(new Circle(), {
            r: Config.visuals.nodeRadius,
            fillStyle: Config.visuals.nodeColor,
            hidden: true
        })
        return node
    }
}