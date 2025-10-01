class AnimationManager {
    transitions = new Set()

    add(t) {
        this.transitions.add(t)
        return t
    }

    update(dt) {
        for (const t of this.transitions) {
            t.update(dt)

            if (t.done) this.transitions.delete(t)
        }
    }
}


class Transition {
    constructor({ from=0, to=1, duration, lerp = (a, b, t) => a + (b - a) * t, onUpdate, onComplete }) {
        this.from = from
        this.to = to
        this.duration = duration
        this.lerp = lerp
        this.onUpdate = onUpdate
        this.onComplete = onComplete
        this.elapsed = 0
        this.done = false

        this.promise = new Promise(resolve => { this.resolve = resolve })
    }

    update(dt) {
        if (this.done) return

        this.elapsed += dt
        const t = Math.min(1, this.elapsed / this.duration)  // Normalized (0-1)
        const val = this.lerp(this.from, this.to, t)
        this.onUpdate(val, t)

        if (t >= 1) {
            // Transition is complete - set to done and call the onComplete function (if one was given)
            this.done = true
            this.resolve()
            this.onComplete?.()
        }
    }
    // Make it await-able
    then(resolve, reject) {
        return this.promise.then(resolve, reject)
    }
}