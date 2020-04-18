import Vec2 from "./vec2";

export default class UIElement {
    tl: Vec2;
    br: Vec2;
    handler: () => void;

    public constructor(ctx: CanvasRenderingContext2D, text: string, pos: Vec2, handler: () => void) {
        let extents = ctx.measureText(text);
        this.tl = new Vec2(pos.x - extents.actualBoundingBoxLeft, pos.y - extents.actualBoundingBoxAscent);
        this.br = new Vec2(pos.x + extents.actualBoundingBoxRight, pos.y + extents.actualBoundingBoxDescent);
        this.handler = handler;
        ctx.fillText(text, pos.x, pos.y);
    }

    public CheckHit(pos: Vec2): boolean {
        if (pos.x >= this.tl.x && pos.x < this.br.x && pos.y >= this.tl.y && pos.y < this.br.y) {
            this.handler();
            return true;
        }
        return false;
    }
}
