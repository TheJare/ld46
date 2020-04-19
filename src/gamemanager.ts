import Vec2 from "./vec2";
import Camera from "./camera";

export class State {
    public time: number;

    public constructor(public game: GameManager) {
        this.time = 0;
    }

    public get ctx(): CanvasRenderingContext2D { return this.game.ctx; }
    public get cam(): Camera { return this.game.cam; }

    public Enter() {}
    public Exit() {}
    public Tick(dt: number) {
        this.time += dt;
    }
    public Resize() {}
    public Click(pos: Vec2) {}
    public MouseDown(pos: Vec2) {}
    public MouseUp(pos: Vec2) {}
    public MouseMove(pos: Vec2, pressed: boolean) {}
}

export class GameManager {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public cam: Camera;
    public state: State;
    nextState: State;
    public time: number = 0;
    private usingTouch = false;

    public constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.cam = new Camera(this.canvas);
        this.state = new State(this);
        window.addEventListener('resize', () => {this.cam = new Camera(this.canvas); this.state.Resize()});
        this.canvas.addEventListener('click', (e) => this.state.Click(this.cam.Screen2Canvas(new Vec2(e.offsetX, e.offsetY))));
        this.canvas.addEventListener('mousedown', (e) => { if (!this.usingTouch) this.state.MouseDown(this.cam.Screen2Canvas(new Vec2(e.offsetX, e.offsetY)))});
        this.canvas.addEventListener('mouseup', (e) => { if (!this.usingTouch) this.state.MouseUp(this.cam.Screen2Canvas(new Vec2(e.offsetX, e.offsetY)))});
        this.canvas.addEventListener('mousemove', (e) => { if (!this.usingTouch) this.state.MouseMove(this.cam.Screen2Canvas(new Vec2(e.offsetX, e.offsetY)), e.buttons != 0)});
        // Everything would be nicer with pointer events, thanks Apple.
        this.canvas.addEventListener('touchstart', (e) => { this.usingTouch = true; this.state.MouseDown(this.cam.Screen2Canvas(new Vec2(e.changedTouches[0].clientX, e.changedTouches[0].clientY)))});
        this.canvas.addEventListener('touchend', (e) => { this.usingTouch = true; this.state.MouseUp(this.cam.Screen2Canvas(new Vec2(e.changedTouches[0].clientX, e.changedTouches[0].clientY)))});
        this.canvas.addEventListener('touchmove', (e) => { this.usingTouch = true; this.state.MouseMove(this.cam.Screen2Canvas(new Vec2(e.changedTouches[0].clientX, e.changedTouches[0].clientY)), true)});

        window.requestAnimationFrame(() => this.Tick());
    }

    public QueueState(state: State)
    {
        if (!state) {
            state = new State(this);
        }
        this.nextState = state;
    }

    public Tick()
    {
        let ct = Date.now();
        if (this.time === 0) {
            this.time = ct;
        }
        let dt = Math.min((ct - this.time)/1000, 0.33); // Limit long frames
        this.time = ct;
        if (this.nextState) {
            this.state.Exit();
            this.state = this.nextState;
            this.nextState = null;
            this.state.Enter();
        }
        if (dt > 0) {
            this.state.Tick(dt);
        } else {
            console.log(`dt = ${dt}, time = ${this.time}, ct = ${ct}`);
        }
        window.requestAnimationFrame(() => this.Tick());
    }
}
