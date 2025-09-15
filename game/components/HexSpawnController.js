class HexSpawnController extends Component {
    start(){

    }

    update(){

    }

    draw(){

    }

    spawnHex(position, axialCoords, layout){
        const hexObject = new HexGameObject(axialCoords)
        const hex = hexObject.getComponent("HexStateController")
        const colors = Object.values(HexGridConfig.colors)             // TODO (placeholder)

        hex.type = HexGridConfig.types.basic                           // TODO (placeholder)
        hex.color = colors[Math.floor(Math.random() * colors.length)]  // TODO (placeholder)
        GameObject.instantiate(hexObject, position)

        hexObject.addComponent(new Polygon(), {
            points: layout.hexVertexOffsets,
            lineWidth: HexGridConfig.visuals.hexOutlinePx,
            strokeStyle: HexGridConfig.visuals.hexOutlineColor,
            fillStyle: hex.color
        })
        return hex
    }
}