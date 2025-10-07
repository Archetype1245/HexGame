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
    static colors = {
        red: "#a70000ff",
        orange: "#ff6200ff",
        lightblue: "#0092d1ff",
        green: "#006e07ff",
        blue: "#030dc8ff",
        purple: "#64009aff"
    }
    static starColor = "#e7e7e7ff"

    static types = {
        basic: "basic",
        bonus: "bonus",
        star: "star",
        bomb: "bomb",
        node: "node"
    }
    static animations = {
        totalNodeRotations: 3,
        // Times in ms
        fallSpeed: 1.75,
        fallDelay: 80,
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
