class MatchController extends Component {
    start(){
        this.scene = SceneManager.getActiveScene()
        this.layout = this.gameObject.getComponent(LayoutController)
        this.hexSpawner = this.gameObject.getComponent(HexSpawnController)
        this.data = this.scene.gridData
        this.game = this.scene.gameState
        this.queuedHexesByCol = new Map()
    }

    checkForMatches(node) {
        const nodesToCheck = node.perimeterNodes
        const cellsToCheck = node.perimeterCellKeys      // TODO: use this to check for other match types, when added
        const matchedHexes = new Set()

        // Check nodes for basic matches
        for (const node of nodesToCheck) {
            const hexes = node.neighbors.map(cell => this.data.axialInfo.get(cell.toKey()).hex)

            const allMatch = hexes.every((hex, idx, arr) => hex?.color === arr[0]?.color)
            if (allMatch) hexes.forEach(h => matchedHexes.add(h))  // All hexes had matching colors - add them to matches
        }
        return matchedHexes
    }

    async processMatches(matchedHexes) {
        this.game.set(GameState.Phase.matching)
        while (matchedHexes.size > 0) {
            const affectedColsData = new Map()
            for (const hex of matchedHexes) {
                this.updateAffectedCols(affectedColsData, hex.cell)

                this.data.deleteHex(hex.cell.toKey())
                hex.gameObject.destroy()
            }

            const cascadingScopes = await this.processGravity(affectedColsData)
            matchedHexes = this.checkForCascades(cascadingScopes) ?? new Set()
        }
        this.game.set(GameState.Phase.idle)
    }

    updateAffectedCols(affectedColsData, cell) {
        const q = cell.q
        const r = cell.r
        let entry = affectedColsData.get(q)
        if (!entry) {
            entry = { lowestRow: Infinity, hexesToSpawn: 0 }
            affectedColsData.set(q, entry)
        }
        entry.lowestRow = Math.min(entry.lowestRow, r)
        entry.hexesToSpawn++
    }

    async processGravity(affectedColsData) {
        const transitions = []
        const cascadingScopes = { nodesToCheck: new Set(), cellsToCheck: new Set() }

        for (let [q, data] of affectedColsData) {
            const rMax = HexMath.rMaxForGivenQ(q)
            let emptyCells = 0

            const moves = []
            // Grab data for existing hexes in column
            for (let r = data.lowestRow; r <= rMax; r++) {
                const cell = new HexCoordinates(q, r)
                const key = cell.toKey()

                const entry = this.data.axialInfo.get(key)
                // Per cell, get all nodes -> filter out holes in array -> add nodes to scope
                entry.nodesByVertex
                    .filter(Boolean)
                    .forEach(n => cascadingScopes.nodesToCheck.add(n))
                // Per cell, get all valid neighbor cells -> add valid calls to scope (as keys)
                cell.getValidNeighbors().forEach(c => cascadingScopes.cellsToCheck.add(c.toKey()))
                
                const hex = entry.hex
                if (!hex) { emptyCells++; continue }

                const newR = r - emptyCells
                const newCell = new HexCoordinates(q, newR)

                const toPos = this.layout.getHexCenter(newCell)
                const fromPos = hex.transform.position
                const delay = (r + 1 - data.lowestRow) * Config.animations.fallDelay

                this.data.deleteHex(key)
                moves.push({ hex, newCell, fromPos, toPos, delay })
            }
            // Spawn new hexes to replace those that were destroyed (and get their data)
            if (data.hexesToSpawn && data.hexesToSpawn > 0) {
                const startIndex = data.lowestRow + moves.length
                for (let i = 0; i < data.hexesToSpawn; i++) {
                    const newCell = new HexCoordinates(q, startIndex + i)
                    const toPos = this.layout.getHexCenter(newCell)

                    const rSpawn = 0 - (this.layout.hexH/2 + ((q & 1) ? 0 : 0.5) * this.layout.hexH + this.layout.hexH * i)
                    const fromPos = new Vector2(toPos.x, rSpawn)
                    
                    const hex = this.hexSpawner.spawnHex(fromPos)
                    hex.transform.position = fromPos
                    const delay = (rMax - data.lowestRow + 1) * Config.animations.fallDelay

                    moves.push({ hex, newCell, fromPos, toPos, delay })
                }
            }

            for (const m of moves) {
                const p = this.fallAnimation(m).then(() => {
                    m.hex.transform.position = m.toPos
                    m.hex.cell = m.newCell
                    this.data.addHex(m.newCell.toKey(), m.hex)
                })
                transitions.push(p)
            }
        }
        await Promise.allSettled(transitions)      // Wait for all hexes to stop falling before continuing
        return cascadingScopes
    }

    checkForCascades(scope) {
        const matchedHexes = new Set()
        for (const node of scope.nodesToCheck) {
            const matches = this.checkForMatches(node)
            for (const h of matches) matchedHexes.add(h)
        }
        // TODO: check cellsToCheck for star-matches after implementing them
        return matchedHexes
    }

    fallAnimation(m) {
        const duration = (m.toPos.y - m.fromPos.y) / Config.animations.fallSpeed
        return Engine.animation.add(new Transition({
            from: m.fromPos,
            to: m.toPos,
            duration: duration,
            delay: m.delay,
            lerp: (from, to, t) => {
                const newY = from.y + (to.y - from.y)*t
                return new Vector2(from.x, newY)
            },
            onUpdate: (newPos) => m.hex.transform.position = newPos
        }))
    }

}