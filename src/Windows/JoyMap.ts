import { OWWindow } from "@overwolf/overwolf-api-ts";
import { WindowName } from "../WindowName";

// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared across the desktop and in-game windows.
export class JoyMap {
    protected currWindow: OWWindow;
    protected mainWindow: OWWindow;
    protected maximized: boolean = false;

    constructor() {
        this.mainWindow = new OWWindow(WindowName.Application);
        this.currWindow = new OWWindow(WindowName.JoyMap);

        const closeButton = document.getElementById('closeButton');
        const maximizeButton = document.getElementById('maximizeButton');
        const minimizeButton = document.getElementById('minimizeButton');

        const header = document.getElementById('header');

        this.setDrag(header);

        closeButton.addEventListener('click', () => {
            this.mainWindow.close();
        });

        minimizeButton.addEventListener('click', () => {
            this.currWindow.minimize();
        });

        maximizeButton.addEventListener('click', () => {
            if (!this.maximized) {
                this.currWindow.maximize();
            } else {
                this.currWindow.restore();
            }

            this.maximized = !this.maximized;
        });
    }

    public async getWindowState() {
        return await this.currWindow.getWindowState();
    }

    private async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}

new JoyMap();