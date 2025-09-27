class Input {
    static mouseX = 0
    static mouseY = 0
    static lastMouseX = 0
    static lastMouseY = 0
    static mouseDown = false
    static mouseUp = false
    static keysDown = []

    static finishFrame() {
        Input.lastMouseX = Input.mouseX
        Input.lastMouseY = Input.mouseY
        Input.mouseUp = false
    }

    static keyDown(event) {
        if (!Input.keysDown.includes(event.code))
            Input.keysDown.push(event.code)

    }
    static keyUp(event) {
        Input.keysDown = Input.keysDown.filter(k => k != event.code)
    }

    static mouseMove(event) {
        Input.lastMouseX = Input.mouseX;
        Input.lastMouseY = Input.mouseY;

        Input.mouseX = event.clientX
        Input.mouseY = event.clientY
    }

    static mouseDown(event) {
        Input.lastMouseX = Input.mouseX;
        Input.lastMouseY = Input.mouseY;

        Input.mouseX = e.clientX
        Input.mouseY = e.clientY
        Input.mouseDown = true;
    }

    static mouseUp(event) {
        Input.lastMouseX = Input.mouseX;
        Input.lastMouseY = Input.mouseY;

        Input.mouseX = e.clientX
        Input.mouseY = e.clientY
        Input.mouseDown = false;
        Input.mouseUp = true;
    }
}