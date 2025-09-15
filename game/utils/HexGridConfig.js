class HexGridConfig {
    static grid = {
        columns: 10,
        rows: 8,
        hexRadius: 30,
        screenWidthPct: 0.95,
        screenHeightPct: 0.60
    }
    static visuals = {
        background: "#0a0d12",
        hexOutlinePx: 3,
        hexOutlineColor: "#9fb3ff"
    }
    static colors = {
        red: "#a70000ff",
        orange: "#ff8800ff",
        yellow: "#0092d1ff",
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
    static gravity = {
        fallSpeed: 80,
        fallDelay: 0.05
    }
}

window.HexGridConfig = HexGridConfig
