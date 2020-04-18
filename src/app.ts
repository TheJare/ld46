import { GameManager } from "./gamemanager";
import MenuState from "./states/menustate";

var game = new GameManager();
game.QueueState(new MenuState(game));
