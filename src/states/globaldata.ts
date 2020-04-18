import Vec2 from "../vec2";
import { RequestFullscreen, IsFullscreen } from "../fullscreen";
import UIElement from "../uielement";
import { State } from "../gamemanager";
import GameState from "./gamestate";

export default class GlobalData
{
    public highScores: number[] = [];
    public lastHighScore: number;

    public AddScore(score: number) {
        let insertAt = 0;
        for (let i = this.highScores.length-1; i >= 0; i--) {
            if (this.highScores[i] >= score) {
                insertAt = i+1;
                break;
            }
        }
        if (insertAt < this.highScores.length) {
            this.highScores.splice(insertAt, 0, score);
            this.lastHighScore = insertAt;
            if (this.highScores.length > 5) {
                this.highScores.splice(5, 1);
            }
        } else if (this.highScores.length < 5) {
            this.lastHighScore = this.highScores.length;
            this.highScores.push(score);
        } else {
            this.lastHighScore = -1;
        }
    }
}
