class GridData {
    constructor() {
        this.axialInfo = new Map()
        this.nodeInfo = new Map()
    }

    clear() {
        this.axialInfo.clear()
        this.nodeInfo.clear()
    }

    addHex(key, hexController) {
        if (this.axialInfo.has(key)) this.axialInfo.get(key).hex = hexController
        else this.axialInfo.set(key, {hex: hexController, nodesByVertex: []})
    }

    deleteHex(key) {
        const entry = this.axialInfo.get(key)
        if (entry) entry.hex = null
    }

    getHex(key) {
        return this.axialInfo.get(key)?.hex ?? null
    }

    addNodeByVertex(key, idx, node) {
        let entry = this.axialInfo.get(key)
        if (entry) {
            if (entry.nodesByVertex) entry.nodesByVertex[idx] = node
            else {
                entry.nodesByVertex = []
                entry.nodesByVertex[idx] = node
            }
        } else {
            entry = { hex: null, nodesByVertex: [] }
            this.axialInfo.set(key, entry)
            entry.nodesByVertex[idx] = node
        }
    }

    getNodeByVertex(key, idx) {
        return this.axialInfo.get(key)?.nodesByVertex[idx] ?? null
    }

    addNode(key, node) {
        this.nodeInfo.set(key, node)
    }

    getNode(key) {
        return this.nodeInfo.get(key)
    }

}