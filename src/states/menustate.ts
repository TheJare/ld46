import Vec2 from "../vec2";
import { RequestFullscreen, IsFullscreen } from "../fullscreen";
import UIElement from "../uielement";
import { State, GameManager } from "../gamemanager";
import GameState from "./gamestate";
import GlobalData from "./globaldata";

export default class MenuState extends State
{
    ui: UIElement[] = [];

    public constructor(game: GameManager, public globalData: GlobalData) {
        super(game);
    }

    public Tick(dt: number) {
        this.ui = [];

        this.game.ctx.fillStyle = "#001020";
        this.game.ctx.fillRect(0, 0, this.game.cam.size.x, this.game.cam.size.y);

        this.game.ctx.font = '48px sans-serif';
        this.game.ctx.textAlign = "center";
        this.game.ctx.fillStyle = "#FFFFFF";
        this.ui.push(new UIElement(this.game.ctx, 'Keep it Alive', new Vec2(this.game.cam.size.x/2, this.game.cam.size.y/3),
            () => this.game.QueueState(new GameState(this.game, this.globalData))
        ));
        this.game.ctx.fillStyle = "#50C0FF";
        this.game.ctx.font = '28px sans-serif';
        this.ui.push(new UIElement(this.game.ctx, IsFullscreen()? 'Exit fullscreen' : 'Go fullscreen', new Vec2(this.game.cam.size.x/2, this.game.cam.size.y/2+70),
            () => RequestFullscreen(this.game.canvas)
        ));

        this.game.ctx.fillStyle = "#BBBBBB";
        this.game.ctx.font = '16px sans-serif';
        this.game.ctx.textAlign = "right";
        this.game.ctx.fillText('A Ludum Dare #46 entry', this.game.cam.size.x, this.game.cam.size.y-60);
        this.game.ctx.fillText('by Javier Arevalo', this.game.cam.size.x, this.game.cam.size.y-30);

        this.game.ctx.font = '20px sans-serif';
        this.game.ctx.fillStyle = "#00FFFF";
        this.game.ctx.textAlign = "left";
        this.game.ctx.fillText('High Scores', 5, this.game.cam.size.y-200);
        this.game.ctx.textAlign = "right";
        for (let i = 0; i < 5; i++) {
            this.game.ctx.fillStyle = (this.globalData.lastHighScore == i)? "#FFFFFF" : "#FFFF00";
            this.game.ctx.fillText((i < this.globalData.highScores.length)? this.globalData.highScores[i].toString() : "----", 75, this.game.cam.size.y-160+24*i);
        }
    }

    public Click(pos: Vec2) {
        for (let c of this.ui) {
            if (c.CheckHit(pos)) {
                break;
            }
        }
    }
}
