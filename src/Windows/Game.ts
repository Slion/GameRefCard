import { Device } from "../Device";
import { Log } from "../Log";
import { Utils } from "../Utils";
import { RefCard } from "./RefCard";

/**
 * Game window class.
 * TODO: Abstract game for multiple game support
 * Right now we are MW5 specific.
 * Use game adapter to achieve this.
 */
export class Game extends RefCard {

    

    constructor() {
        super()
        Log.d("Window.Game constructor");
    }



}


