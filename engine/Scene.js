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
            // Insert layer value at the appropriate index
            // Could binary search, but don't anticipate having a huge layer count
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

    static instantiate(gameObject, { position = null, scene = null, layer = 0 } = {}) {
        // Assign current scene to the given argument, otherwise grab it
        const currentScene = scene ?? SceneManager.getActiveScene()
        currentScene.gameObjects.push(gameObject)

        // Assign layer to the given argument, otherwise set to 0-default
        gameObject.layer = layer ?? 0
        currentScene.addToLayer(layer, gameObject)

        if (position) gameObject.transform.position = position
        // Start the gameobject if the scene is already started, otherwise let it automatically start when the scene does
        if (currentScene.started) gameObject.start()
        return gameObject
    }
}