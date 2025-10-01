// class Transform extends Component{
//     position = new Vector2(0,0)
//     rotation = 0
//     scale = new Vector2(1,1)
// }

class Transform extends Component {
    constructor() {
        super()
        this.parent = null
        this.children = []
        this.localPosition = Vector2.zero
        this.localRotation = 0
        this.localScale = Vector2.one
    }

    get position() {
        if (!this.parent) return this.localPosition.clone() // No parent, world position is just local position

        const pPos = this.parent.position
        const pRot = this.parent.rotation
        const pScale = this.parent.scale

        const c = Math.cos(pRot)
        const s = Math.sin(pRot)
        // Multiply by parent's scale
        const x = this.localPosition.x * pScale.x
        const y = this.localPosition.y * pScale.y

        /* 
         * Any 2D vector can be written as r*(cos(ϕ), sin(ϕ))
         * Rotating by θ results in r*(cos(ϕ+θ), sin(ϕ+θ))
         * Then -> cos(ϕ+θ) = cos(ϕ)*cos(θ) - sin(ϕ)*sin(θ); sin(ϕ+θ) -> sin(ϕ)cos(θ) + cos(ϕ)sin(θ)
         * If x = r*cos(ϕ) and y = r*sin(ϕ) -> (x', y') = (x*cos(θ) - y*sin(θ), x*sin(θ) + y*cos(θ))
         * This is the basis for the following world position calculation
         * Of course, we also add in the parent's x or y position
         */
        const worldX = pPos.x + (x*c - y*s)
        const worldY = pPos.y + (x*s + y*c)

        return new Vector2(worldX, worldY)
    }

    set position(world) {
        if (!this.parent) {
            this.localPosition = world.clone()
            return
        }
        // If we have a parent, we need to calculate our local position
        // as the difference between our world position and our parent's
        const pPos = this.parent.position
        const pRot = this.parent.rotation
        const pScale = this.parent.scale
        // Local deltas, no rotation factored in
        const dx = world.x - pPos.x
        const dy = world.y - pPos.y
        // Opposite of what we did in the getter (above), "undoing" the parent's rotation
        const c = Math.cos(-pRot)
        const s = Math.sin(-pRot)

        const localX = dx*c - dy*s
        const localY = dx*s + dy*c
        // Again, opposite of what we did above - undoing the parent scaling (and guarding against division-by-zero)
        const invScaleX = pScale.x !== 0 ? 1 / pScale.x : 0
        const invScaleY = pScale.y !== 0 ? 1 / pScale.y : 0

        this.localPosition = new Vector2(localX * invScaleX, localY * invScaleY)
    }
    // For rotations, just add (or subtract) the parent's rotation, if it exists.
    get rotation() {
        return this.localRotation + (this.parent ? this.parent.rotation : 0)
    }

    set rotation(angle) {
        this.localRotation = angle - (this.parent ? this.parent.rotation : 0) 
    }

    get scale() {
        if (!this.parent) return this.localScale.clone()

        const pScale = this.parent.scale
        return new Vector2(pScale.x * this.localScale.x, pScale.y * this.localScale.y)
    }

    set scale(s) {
        const pScale = this.parent ? this.parent.scale : Vector2.one
        const invX = pScale.x !== 0 ? 1 / pScale.x : 0
        const invY = pScale.y !== 0 ? 1 / pScale.y : 0
        this.localScale = new Vector2(s.x * invX, s.y * invY)
    }

    setParent(newParent, keepWorldPos=true) {
        const p = this.position
        const r = this.rotation
        const s = this.scale

        if (this.parent) {
            const children = this.parent.children
            const idx = children.indexOf(this)
            if (idx !== -1) children.splice(idx, 1)      // Remove current transform from original parent's list of children
        }

        this.parent = newParent
        if (newParent) newParent.children.push(this)     // Add current transform to new parent's list of children

        if (keepWorldPos) {
        // Update transform's local values according to the new parent's position
        this.rotation = r
        this.scale = s
        this.position = p
        }
    }
}