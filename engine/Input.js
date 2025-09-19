class Input {
    static keysDown = []

    static keyDown(event) {
        if (!Input.keysDown.includes(event.code))
            Input.keysDown.push(event.code)

    }
    static keyUp(event) {
        Input.keysDown = Input.keysDown.filter(k => k != event.code)
    }
}