class GameObject {
    name = ""
    components = []
    hasStarted = false
    markForDeleted = false
    
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

    getComponent(type) {
        return this.components.find(c => c instanceof type)
    }

    get transform() {
        return this.components[0]
    }

    destroy() {
        this.markForDelete = true
    }
}