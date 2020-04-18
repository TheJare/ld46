import { GameManager } from "./gamemanager";
import MenuState from "./states/menustate";
import GlobalData from "./states/globaldata";

var game = new GameManager();
game.QueueState(new MenuState(game, new GlobalData()));
