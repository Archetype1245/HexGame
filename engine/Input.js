class Input {
    static keysDown = []

    static keydown(event) {
        if (!Input.keysDown.includes(event.code))
            Input.keysDown.push(event.code)

    }
    static keyup(event) {
        Input.keysDown = Input.keysDown.filter(k => k != event.code)
    }
}