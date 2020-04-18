import Vec2 from "../vec2";
import RequestFullscreen from "../fullscreen";
import UIElement from "../uielement";
import { State } from "../gamemanager";
import GameState from "./gamestate";

export default class MenuState extends State
{
    ui: UIElement[] = [];
    
    public Tick(dt: number) {
        this.ui = [];

        this.game.ctx.fillStyle = "#001020";
        this.game.ctx.fillRect(0, 0, this.game.cam.size.x, this.game.cam.size.y);

        this.game.ctx.font = '48px sans-serif';
        this.game.ctx.textAlign = "center";
        this.game.ctx.fillStyle = "#FFFFFF";
        this.ui.push(new UIElement(this.game.ctx, 'Keep it Alive', new Vec2(this.game.cam.size.x/2, this.game.cam.size.y/2),
            () => this.game.QueueState(new GameState(this.game))
        ));
        this.game.ctx.font = '28px sans-serif';
        this.ui.push(new UIElement(this.game.ctx, 'Fullscreen', new Vec2(this.game.cam.size.x/2, this.game.cam.size.y/2+70),
            () => RequestFullscreen(this.game.canvas)
        ));

        this.game.ctx.font = '16px sans-serif';
        this.game.ctx.textAlign = "right";
        this.game.ctx.fillText('A Ludum Dare #46 entry', this.game.cam.size.x, this.game.cam.size.y-60);
        this.game.ctx.fillText('by Javier Arevalo', this.game.cam.size.x, this.game.cam.size.y-30);
    }

    public Click(pos: Vec2) {
        for (let c of this.ui) {
            if (c.CheckHit(pos)) {
                break;
            }
        }
    }
}
