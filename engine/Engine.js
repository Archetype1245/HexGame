class Engine {
    static start() {
        Engine.canvas = document.querySelector("#canv")
        Engine.ctx = Engine.canvas.getContext("2d")
        Input.attach(Engine.canvas)

        window.addEventListener("resize", Engine.resizeCanvas)
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
        Input.finishFrame()
    }

    static draw() {
        Engine.ctx.fillStyle = HexGridConfig.visuals.background
        Engine.ctx.beginPath()
        Engine.ctx.rect(0, 0, Engine.canvas.width, Engine.canvas.height)
        Engine.ctx.fill()

        Engine.currentScene.draw(Engine.ctx)
    }

    static resizeCanvas() {
        Engine.canvas.width = window.innerWidth
        Engine.canvas.height = window.innerHeight
    }
}