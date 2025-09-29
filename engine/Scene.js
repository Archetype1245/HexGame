class Scene {
    started = false
    gameObjects = []
    layerGroups = new Map()
    sortedLayers = []

    start() {
        this.started = true
        for (const gameObject of this.gameObjects) {
            gameObject.start()
        }
    }

    update() {
        for (const gameObject of this.gameObjects) {
            if (!gameObject.hasStarted) {
                gameObject.start()
                gameObject.hasStarted = true
            }
            gameObject.update()
        }

        this.gameObjects = this.gameObjects.filter(go => !go.markForDelete)
    }

    draw(ctx) {
        for (const layer of this.sortedLayers) {
            const layerGroup = this.layerGroups.get(layer)
            for (const gameObject of layerGroup) {
                gameObject.draw(ctx)
            }
        }
    }

    addToLayer(layer, gameObject) {
        let layerGroup = this.layerGroups.get(layer)
        if (!layerGroup) {
            layerGroup = new Set()
            this.layerGroups.set(layer, layerGroup)

            const idx = this.sortedLayers.findIndex(i => i > layer)
            if (idx === -1) {
                this.sortedLayers.push(layer)
            }
            else {
                this.sortedLayers.splice(idx, 0, layer)
            }
        }
        layerGroup.add(gameObject)
    }

    static instantiate(gameObject, { position = null, scene = null, layer = 0, forceStart = false}) {
        const currentScene = scene ?? SceneManager.getActiveScene()
        currentScene.gameObjects.push(gameObject)

        gameObject.layer = layer ?? 0
        currentScene.addToLayer(layer, gameObject)

        if (position) gameObject.transform.position = position
        // Bit of a pseudo-Awake()
        if (forceStart) gameObject.start(); gameObject.hasStarted = true
        return gameObject
    }
}