class GameState {
    static Phase = {
        idle: "Idle",
        rotating: "Rotating",
        matching: "Matching",
        resolving: "Resolving"
    }

    phase = GameState.Phase.idle

    set(phase) { this.phase = phase }
    get canInteract() { return (this.phase === GameState.Phase.idle) }
}