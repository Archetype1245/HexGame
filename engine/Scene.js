class Scene {
    started = false
    gameObjects = []
    layerMap = new Map()
    layerOrder = ["background", "foreground"]

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

        this.gameObjects = this.gameObjects.filter(go => {
            if (go.markForDelete) {
                this.removeFromLayerMap(go)
                return false
            }
            return true
        })
    }

    draw(ctx) {
        for (const layer of this.layerOrder) {
            const gameObjects = this.layerMap.get(layer)
            if (gameObjects) gameObjects.forEach(go => go.draw(ctx))
        }
    }

    initLayers() {
        for (const layer of this.layerOrder) {
            this.layerMap.set(layer, new Set())
        }
    }

    addToLayerMap(go) {
        this.layerMap.get(go.layer).add(go)
    }

    removeFromLayerMap(go) {
        this.layerMap.get(go.layer).delete(go)
    }

    static instantiate(gameObject, { position = null, scene = null, layer, forceStart = false }) {
        const currentScene = scene ?? SceneManager.getActiveScene()
        currentScene.gameObjects.push(gameObject)

        gameObject.layer = layer ?? "background"
        currentScene.addToLayerMap(gameObject)

        if (position) gameObject.transform.position = position
        // Basically a way to force a GO's Start() to act like Awake() would
        if (forceStart) gameObject.start(); gameObject.hasStarted = true
        return gameObject
    }
}