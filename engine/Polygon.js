class Polygon extends Component {
    points = []
    fillStyle = "magenta"
    strokeStyle = "black"
    lineWidth = 1
    
    draw(ctx) {
        const pos = this.transform.position
        const scale = this.transform.scale

        ctx.fillStyle = this.fillStyle  
        ctx.lineWidth = this.lineWidth

        ctx.beginPath()
        ctx.moveTo(pos.x + this.points[0].x * scale.x, pos.y + this.points[0].y * scale.y)
        for(let i = 1; i < this.points.length; i++) {
            ctx.lineTo(pos.x + this.points[i].x * scale.x, pos.y + this.points[i].y * scale.y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}