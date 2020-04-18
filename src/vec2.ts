export default class Vec2 {
    public constructor(public x = 0, public y = 0) {
    }
    public clone() {
        return new Vec2(this.x, this.y);
    }
    public set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public copy(o: Vec2) {
        this.x = o.x;
        this.y = o.y;
    }
    public magnitudeSqr(): number {
        return this.x * this.x + this.y * this.y;
    }
    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    public add(o: Vec2): Vec2 {
        this.x += o.x;
        this.y += o.y;
        return this;
    }
    public added(o: Vec2): Vec2 {
        return new Vec2(this.x + o.x, this.y + o.y);
    }
    public sub(o: Vec2): Vec2 {
        this.x -= o.x;
        this.y -= o.y;
        return this;
    }
    public subbed(o: Vec2): Vec2 {
        return new Vec2(this.x - o.x, this.y - o.y);
    }
    public scale(o: Vec2 | number): Vec2 {
        if (o instanceof Vec2) {
            this.x *= o.x;
            this.y *= o.y;
        } else {
            this.x *= o;
            this.y *= o;
        }
        return this;
    }
    public scaled(o: Vec2 | number): Vec2 {
        if (o instanceof Vec2) {
            return new Vec2(this.x * o.x, this.y * o.y);
        }
        return new Vec2(this.x * o, this.y * o);
    }
}
