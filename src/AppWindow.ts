import { OWWindow } from "@overwolf/overwolf-api-ts/dist";
import { Settings } from "./Settings";


/**
 * Extend Window class with data we need to share between our windows.
 */
export class AppWindow extends Window {
    iSettings: Settings;
    iWindowJoyMap: OWWindow;
    iWindowMW5: OWWindow;
    iWindowSettings: OWWindow;
}