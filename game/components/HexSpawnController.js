class HexSpawnController extends Component {
    start(){

    }

    update(){

    }

    draw(){

    }

    spawnHex(position) {
        const hexObject = new HexGameObject()
        const hex = hexObject.getComponent("HexController")

        Scene.instantiate(hexObject, { position: position })
        return hex
    }
}