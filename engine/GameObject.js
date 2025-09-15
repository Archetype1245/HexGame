class GameObject {
    name = ""
    components = []
    constructor(name) {
        this.name = name
        this.addComponent(new Transform())
    }

    start() {
        for (const component of this.components) {
            component.start()
        }
    }

    update() {
        for (const component of this.components) {
            component.update()
        }
    }

    draw(ctx) {
        for (const component of this.components) {
            component.draw(ctx)
        }
    }

    addComponent(component, values) {
        this.components.push(component)
        component.gameObject = this
        Object.assign(component, values)
        return this
    }

    getComponent(name) {
        return this.components.find(component => component.name === name)
    }

    get transform() {
        return this.components[0]
    }

    static instantiate(gameObject, position) {
        let currentScene = SceneManager.getActiveScene()
        currentScene.gameObjects.push(gameObject)

        if (position)
            gameObject.transform.position = position

        gameObject.start()
        return gameObject
    }
}