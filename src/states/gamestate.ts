import Vec2 from "../vec2";
import UIElement from "../uielement";
import { State } from "../gamemanager";
import MenuState from "./menustate";

const kPlayerMaxHealth = 10;

class Entity {
    public pos: Vec2 = new Vec2(0,0);
    public radius: number = 4;
    public vel: Vec2 = new Vec2(0,0);
    public health: number = 1;

    public constructor(public game: GameState, pos: Vec2) {
        this.pos.copy(pos);
    }

    public get alive(): boolean { return this.health > 0; }

    public Render(dt: number) {
        this.game.ctx.fillStyle = "#FF00FF";
        this.game.ctx.fillRect(this.pos.x-this.radius, this.pos.y-this.radius, 2*this.radius, 2*this.radius);
    }

    public Tick(dt: number) {
        this.pos.add(this.vel.scaled(dt));
    }
}

class Player extends Entity {
    public constructor(game: GameState) {
        super(game, new Vec2(0,0));
        this.health = kPlayerMaxHealth;
    }

    public Tick(dt: number) {
        super.Tick(dt);
        let dist = this.game.cursor.subbed(this.pos);
        let md = dist.magnitude();
        if (md > 0.001) {
            this.vel = dist.scaled(100/md);
        } else {
            this.vel.set(0,0);
        }
    }

    public Render(dt: number) {
        this.game.ctx.fillStyle = "#FFFFFF";
        this.game.ctx.fillRect(this.pos.x-this.radius, this.pos.y-this.radius, 2*this.radius, 2*this.radius);
    }

}

class Waterdrop extends Entity {
    public constructor(game: GameState) {
        super(game, new Vec2((Math.random()*0.9 + 0.05)*game.cam.size.x, 1));
        this.vel = new Vec2((Math.random()*2-1)*50, 100);
        this.health = kPlayerMaxHealth;
    }

    public Tick(dt: number) {
        super.Tick(dt);
        if (this.game.player.alive) {
            if (this.pos.subbed(this.game.player.pos).magnitude() < this.radius) {
                this.game.player.health--;
                this.health = -1;
            }
        }
        if (this.pos.x < -this.radius || (this.pos.x-this.radius) >= this.game.cam.size.x || (this.pos.y-this.radius) >= this.game.cam.size.y) {
            this.health = -1;
        }
    }

    public Render(dt: number) {
        this.game.ctx.fillStyle = "#00FFFF";
        this.game.ctx.fillRect(this.pos.x-this.radius, this.pos.y-this.radius, 2*this.radius, 2*this.radius);
    }
}

export default class GameState extends State {
    ui: UIElement[];
    cursor: Vec2;
    public player: Player = new Player(this);
    entities: Entity[];
    private newEntities: Entity[];

    private timeToNextWaterdrop = 0;
    private waterdropsPerSec = 30;

    public Enter() {
        this.player.pos.set(this.game.cam.size.x/2, this.game.cam.size.y/2);
        this.cursor = this.player.pos.clone();
        this.entities = [this.player];
        this.newEntities = [];
    }

    public AddEntity(e: Entity) {
        this.newEntities.push(e);
    }


    public Tick(dt: number) {

        function RunEntities(entities: Entity[], dt: number): Entity[] {
            for (let i = 0; i < entities.length; i++) {
                let e = entities[i];
                if (e.alive) {
                    e.Tick(dt);
                }
                if (e.health < 0) {
                    entities.splice(i, 1);
                    i--;
                }
            }
            return entities;
        }

        // Entity logic
        this.entities = RunEntities(this.entities, dt);
        for (;;) {
            this.newEntities = RunEntities(this.newEntities, dt);
            if (this.newEntities.length == 0) {
                break;
            }
            this.entities = this.entities.concat(this.newEntities);
            this.newEntities = [];
        }

        this.timeToNextWaterdrop -= dt;
        while (this.timeToNextWaterdrop <= 0) {
            this.AddEntity(new Waterdrop(this));
            this.timeToNextWaterdrop = 1/this.waterdropsPerSec;
        }

        if (!this.player.alive) {
            this.game.QueueState(new MenuState(this.game));
        }

        this.Render(dt);
    }

    private Render(dt: number) {
        // Clear background
        this.game.ctx.fillStyle = "#402020";
        this.game.ctx.fillRect(0, 0, this.game.cam.size.x, this.game.cam.size.y);

        // Entity render
        for (let i = 0; i < this.entities.length; i++) {
            let e = this.entities[i];
            if (e.alive) {
                e.Render(dt);
            }
        }

        // UI Render
        this.game.ctx.fillStyle = "#FFF";
        this.game.ctx.fillRect(this.cursor.x-2, this.cursor.y-20, 4, 40);
        this.game.ctx.fillRect(this.cursor.x-20, this.cursor.y-2, 40, 4);

        this.game.ctx.font = '24px sans-serif';
        this.game.ctx.textAlign = "left";
        // this.game.ctx.fillText(`Level: ${this.player.level}`, 2, 24);

        this.game.ctx.fillStyle = "#000";
        this.game.ctx.fillRect(2, 30, 100, 10);
        this.game.ctx.fillRect(2, 43, 100, 10);
        let xpf = 0.5;
        let hpf = this.player.health / kPlayerMaxHealth;
        this.game.ctx.fillStyle = "#4FF";
        this.game.ctx.fillRect(2, 30, 100*xpf, 10);
        this.game.ctx.fillStyle = `rgb(${255*(1-hpf)}, ${255*hpf}, 0)`;
        this.game.ctx.fillRect(2, 43, 100*hpf, 10);
    }

    public Click(p: Vec2) {
    }

    public MouseMove(p: Vec2, pressed: boolean) {
        this.cursor = p;
    }

}
