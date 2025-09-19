class DebugOverlayController extends Component {
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const [key, cell] of this.model.axialInfo) {
            const hex = cell.hex;
            const pos = hex.transform.position;
            ctx.fillText(key, pos.x, pos.y);
        }

        ctx.restore();
    }
}