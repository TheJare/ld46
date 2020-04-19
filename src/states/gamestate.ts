import Vec2 from "../vec2";
import UIElement from "../uielement";
import { State, GameManager } from "../gamemanager";
import MenuState from "./menustate";
import GlobalData from "./globaldata";

const kPlayerMaxHealth = 10;
const kPlayerMaxStrength = 100;

enum EntityType {
    BaseEntity,
    Player,
    Waterdrop,
    Block,
    FastDrop,
    TrackerDrop
}

class Entity {
    public pos: Vec2 = new Vec2(0,0);
    public radius: number = 4;
    public vel: Vec2 = new Vec2(0,0);
    public health: number = 1;
    public type: EntityType = EntityType.BaseEntity;
    public time: number = 0;

    public constructor(public game: GameState) {
    }

    public get alive(): boolean { return this.health > 0; }

    public Render(dt: number) {
        this.game.ctx.fillStyle = "#FF00FF";
        this.game.ctx.fillRect(this.pos.x-this.radius, this.pos.y-this.radius, 2*this.radius, 2*this.radius);
    }

    public Tick(dt: number) {
        this.time += dt;
        this.pos.add(this.vel.scaled(dt));
    }
}

class Player extends Entity {
    speed: number = 100;
    public strength: number = kPlayerMaxStrength;

    public constructor(game: GameState) {
        super(game);
        this.radius = 7;
        this.health = kPlayerMaxHealth;
        this.type = EntityType.Player;
    }

    public DeltaStrength(delta: number) {
        this.strength = Math.max(0, Math.min(100, this.strength + delta));
        if (this.strength <= 0) {
            this.health--;
            this.strength = kPlayerMaxStrength/4;
        }
    }

    public Tick(dt: number) {
        super.Tick(dt);
        let dist = this.game.cursor.subbed(this.pos);
        let md = dist.magnitude();
        if (md > 2) {
            this.vel = dist.scaled(this.speed/md);
            this.DeltaStrength(-30*dt);
        } else {
            this.vel.set(0,0);
            this.DeltaStrength(50*dt);
        }
    }

    public Render(dt: number) {
        if (this.alive || ((this.game.time*10) % 10) < 5) {
            this.game.ctx.fillStyle = "#FFFFFF";
            this.game.ctx.beginPath();
            this.game.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
            this.game.ctx.fill();
        }
    }

}

class Waterdrop extends Entity {
    color: string = "#00FFFF";

    public constructor(game: GameState) {
        super(game);
        this.pos = new Vec2((Math.random()*1.2 - 0.1)*game.cam.size.x, 1-this.radius);
        this.vel = new Vec2((Math.random()*2-1)*15, (Math.random()*0.2+1)*60);
        this.health = kPlayerMaxHealth;
        this.type = EntityType.Waterdrop;
    }

    public Tick(dt: number) {
        super.Tick(dt);
        if (this.game.player.alive) {
            if (this.pos.subbed(this.game.player.pos).magnitude() < this.radius) {
                this.game.player.DeltaStrength(-30);
                this.game.player.health--;
                this.health = -1;
            }
        }
        if (this.pos.x < -this.radius || (this.pos.x-this.radius) >= this.game.cam.size.x || (this.pos.y-this.radius) >= this.game.cam.size.y) {
            this.health = -1;
        }
    }

    public Render(dt: number) {
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.pos.x-this.radius, this.pos.y-this.radius, 2*this.radius, 2*this.radius);
    }
}

class FastDrop extends Waterdrop {
    public constructor(game: GameState) {
        super(game);
        this.type = EntityType.FastDrop;
        this.pos.y -= (8-this.radius);
        this.radius = 8;
        this.vel.y *= 2;
    }
}

class Sprinkler extends Waterdrop {
    spurtTimer: number = 1;

    public constructor(game: GameState) {
        super(game);
        this.pos.y -= (7-this.radius);
        this.radius = 7;
        this.color = "#70FF40";
    }

    public Tick(dt: number) {
        super.Tick(dt);
        if (this.alive) {
            this.spurtTimer -= dt;
            if (this.spurtTimer <= 0) {
                this.spurtTimer = 1;
                for (let i = 0; i < 4; i++) {
                    let e = new Waterdrop(this.game);
                    let a = this.time + i*Math.PI/2/4;
                    e.vel = (new Vec2(Math.cos(a), Math.sin(a))).scale(100);
                    e.pos = this.pos.clone();
                    this.game.AddEntity(e);
                }
            }
        }
    }
}

class TrackerDrop extends Waterdrop {

    public constructor(game: GameState) {
        super(game);
        // this.type = EntityType.TrackerDrop;
        this.pos.y -= (7-this.radius);
        this.radius = 7;
        this.color = "#FFFF40";
    }

    public Tick(dt: number) {
        super.Tick(dt);
        if (this.alive) {
            let accel = 200;
            if (this.pos.x < this.game.player.pos.x) {
                this.vel.x += accel*dt;
            } else if (this.pos.x > this.game.player.pos.x) {
                this.vel.x -= accel*dt;
            }
            if (this.pos.y < this.game.player.pos.y) {
                this.vel.y += accel*dt;
            } else if (this.pos.y > this.game.player.pos.y) {
                this.vel.y -= accel*dt;
            }
            let speed = this.vel.magnitude();
            if (speed > 150) {
                this.vel.scale(150/speed);
            }
        }
    }
}

class Block extends Entity {
    public constructor(game: GameState) {
        super(game);
        this.radius = 80;
        this.pos = new Vec2((Math.random()*0.9 + 0.05)*game.cam.size.x, 1-this.radius);
        this.vel = new Vec2((Math.random()*2-1)*5, 40);
        this.type = EntityType.Block;
    }

    public Tick(dt: number) {
        super.Tick(dt);
        if (this.game.player.alive) {
            if (this.pos.subbed(this.game.player.pos).magnitude() < this.radius) {
                this.game.player.health = 0; // Instakill
                this.health = 0;
            }
        }
        for (let i = 0; i < this.game.entities.length; i++) {
            let e = this.game.entities[i];
            if (e.type == EntityType.Waterdrop && this.pos.subbed(e.pos).magnitude() < this.radius) {
                e.health = -1;
            }
        }
        if (this.pos.x < -this.radius || (this.pos.x-this.radius) >= this.game.cam.size.x || (this.pos.y-this.radius) >= this.game.cam.size.y) {
            this.health = -1;
        }
    }

    public Render(dt: number) {
        this.game.ctx.fillStyle = "#000000";
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
        this.game.ctx.fill();
    }
}

export default class GameState extends State {
    ui: UIElement[];
    cursor: Vec2;
    public player: Player;
    public entities: Entity[];
    private newEntities: Entity[];
    private lastDrag: Vec2 = new Vec2(0,0);
    private score = 0;

    private timeToNextEnemy = 0;
    private enemiesPerSec = 30;
    private numEnemies = 0;

    private gameoverTimer = 4;

    public constructor(game: GameManager, public globalData: GlobalData) {
        super(game);
    }

    public Enter() {
        this.player = new Player(this);
        this.player.pos.set(this.game.cam.size.x/2, this.game.cam.size.y/2);
        this.cursor = this.player.pos.clone();
        this.entities = [this.player];
        this.newEntities = [];
    }

    public AddEntity(e: Entity) {
        this.newEntities.push(e);
    }

    private GameplayLogic(dt: number) {
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

        this.timeToNextEnemy -= dt;
        while (this.timeToNextEnemy <= 0) {
            this.numEnemies++;
            let enemySpawnChances = [
                { mod: 100, val:  0, type: Block },
                { mod:  80, val: 30, type: Sprinkler },
                { mod: 170, val: 66, type: TrackerDrop },
                { mod:  23, val:  7, type: FastDrop },
                { mod:   1, val:  0, type: Waterdrop }
            ];
            for (let chance of enemySpawnChances) {
                if ((this.numEnemies % chance.mod) == chance.val) {
                    this.AddEntity(new chance.type(this));
                    break;
                }
            }
            this.timeToNextEnemy = 1/this.enemiesPerSec;
        }
        this.score = this.time;
    }

    public Tick(dt: number) {
        super.Tick(dt);

        if (this.player.alive) {
            this.GameplayLogic(dt);
        }

        if (!this.player.alive) {
            this.gameoverTimer -= dt;
            if (this.gameoverTimer <= 0) {
                this.globalData.AddScore(Math.floor(this.score));
                this.game.QueueState(new MenuState(this.game, this.globalData));
            }
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
            e.Render(dt);
        }

        // UI Render
        // this.game.ctx.fillStyle = "#FFF";
        // this.game.ctx.fillRect(this.cursor.x-2, this.cursor.y-20, 4, 40);
        // this.game.ctx.fillRect(this.cursor.x-20, this.cursor.y-2, 40, 4);

        this.game.ctx.fillStyle = "#FFF";
        this.game.ctx.font = '24px sans-serif';
        this.game.ctx.textAlign = "left";
        this.game.ctx.fillText(`Score: ${Math.floor(this.score)}`, 2, 24);

        this.game.ctx.fillStyle = "#000";
        this.game.ctx.fillRect(1, 29, 152, 16);
        this.game.ctx.fillRect(1, 49, 152, 16);
        let xpf = Math.pow(this.player.strength / 100, 2);
        let hpf = this.player.health / kPlayerMaxHealth;
        this.game.ctx.fillStyle = "#4FF";
        this.game.ctx.fillRect(2, 30, 150*xpf, 14);
        this.game.ctx.fillStyle = `rgb(${255*(1-hpf)}, ${255*hpf}, 0)`;
        this.game.ctx.fillRect(2, 50, 150*hpf, 14);
    }

    public Click(p: Vec2) {
    }

    public MouseDown(p: Vec2) {
        this.lastDrag = p;
    }

    public MouseUp(p: Vec2) {
        this.cursor = this.player.pos.clone();
    }

    public MouseMove(p: Vec2, pressed: boolean) {
        if (pressed) {
            this.cursor = this.cursor.add(p.subbed(this.lastDrag));
            this.lastDrag = p;
        } else {
            this.cursor = p;
        }
    }

}
