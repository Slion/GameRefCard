import { AppWindow } from "../AppWindow";
import { Log } from "../Log";
import { Base } from "../Windows/Base";

/**
 * Game adapter class.
 * Provide functionality common to all our windows.
 */
export class Adapter extends Base {


    constructor() {
        super();
        Log.d("Window.Base constructor");
    }


}


