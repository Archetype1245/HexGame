class Engine {
    static start() {
        Engine.canvas = document.querySelector("#canv")
        Engine.ctx = Engine.canvas.getContext("2d")
        addEventListener("resize", Engine.resizeCanvas)

        Engine.resizeCanvas()
        Engine.currentScene.start()
        Engine.gameLoop()
    }

    static gameLoop() {
        Engine.update()
        Engine.draw()
        requestAnimationFrame(Engine.gameLoop)
    }

    static update() {
        Engine.currentScene.update()
    }

    static draw() {
        Engine.ctx.fillStyle = "#00102aff"
        Engine.ctx.beginPath()
        Engine.ctx.rect(0, 0, Engine.canvas.width, Engine.canvas.height)
        Engine.ctx.fill()

        Engine.currentScene.draw(Engine.ctx)
    }

    static resizeCanvas() {
        Engine.canvas.width = (window.innerWidth)
        Engine.canvas.height = (window.innerHeight)
    }
}