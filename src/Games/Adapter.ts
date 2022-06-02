import { AppWindow } from "../AppWindow";
import { Log } from "../Log";
import { Base } from "../Base";
import { RefCard } from "../Windows/RefCard";

/**
 * Game adapter class.
 * Provide functionality common to all our windows.
 */
export abstract class Adapter extends Base {


    constructor() {
        super();
        Log.d("Game.Adapter constructor");
    }

    abstract BuildRefCard(aRefCard: RefCard);


}


