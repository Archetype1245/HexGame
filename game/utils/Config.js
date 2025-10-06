class Config {
    static grid = {
        columns: 10,
        rows: 8,
        hexRadius: 30,
        screenWidthPct: 0.95,
        screenHeightPct: 0.60
    }
    static visuals = {
        background: "#00102aff",
        hexOutlinePx: 3,
        hexOutlineColor: "#000000ff",
        nodeOutlineColor: "white",
        nodeColor: "yellow",
        nodeRadius: 7
    }
    static hexColors = {
        red: "#a70000ff",
        orange: "#ff6a00ff",
        lightblue: "#0092d1ff",
        green: "#017b09ff",
        blue: "#030dc8ff",
        purple: "#9201e0ff"
    }
    static types = {
        basic: "basic",
        bonus: "bonus",
        star: "star",
        bomb: "bomb"
    }
    static animations = {
        totalNodeRotations: 3,
        // Times in ms
        fallSpeed: 1.5,
        fallDelay: 60,
        rotation: 150
    }

    static layers = {
        background: "background",
        grid: "grid",
        nodes: "nodes",
        rotation: "rotation",
        ui: "ui",
        debug: "debug"
    }
}

window.Config = Config
