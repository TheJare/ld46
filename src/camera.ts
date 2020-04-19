import Vec2 from "./vec2";

export default class Camera {
    public size: Vec2;
    public m2c: Vec2;

    public constructor(canvas: HTMLCanvasElement, size = 1080) {
        let r = canvas.offsetWidth/canvas.offsetHeight;
        this.size = (r > 1)? new Vec2(size, size/r) : new Vec2(size*r, size);
        this.m2c = new Vec2(this.size.x/canvas.clientWidth, this.size.y/canvas.clientHeight);
        canvas.width = this.size.x;
        canvas.height = this.size.y;
    }

    public Screen2Canvas(p: Vec2): Vec2 {
        return p.scaled(this.m2c);
    }
}
