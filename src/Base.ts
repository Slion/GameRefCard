import { AppWindow } from "./AppWindow";
import { Log } from "./Log";

/**
 * Base class.
 * Enable access to global shared data.
 */
export class Base {

    iAppWindow = <AppWindow>overwolf.windows.getMainWindow();

    constructor() {
        Log.d("Window.Base constructor");
    }

    get Settings() { return this.iAppWindow.iSettings; }

}


