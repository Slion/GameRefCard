import { OWWindow } from "@overwolf/overwolf-api-ts";
import { XMLParser } from "fast-xml-parser";
import { Log } from "../Log";
import { WindowName } from "../WindowName";
//import { XMLParser, XMLBuilder, XMLValidator } = require("../src/fxp");

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


        this.LoadVirpilProfile();

    }



    /**
     *
     * @param aPath
     */
    async ReadFile(aPath: string): Promise<overwolf.io.ReadFileContentsResult> {
        console.info(aPath);
        const result: overwolf.io.ReadFileContentsResult = await new Promise(resolve => {
            overwolf.io.readFileContents(
                aPath,
                overwolf.io.enums.eEncoding.UTF8,
                resolve
            );
        });
     
        return result;
    }


    /**
     */
    public async LoadVirpilProfile() {
        //let dir = `${overwolf.io.paths.localAppData}\\Slions\\JoyMap\\MyFile`;

        let virpilProfile = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Virpil\\Profiles\\alpha-warbrd-left-03EB-9901.XML';
        let result = await this.ReadFile(virpilProfile);
        Log.d(result);
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "a"
        };
        const parser = new XMLParser(options);

        let xml = parser.parse(result.content);
        Log.d(xml);

        Log.d(`Logical ${xml.VIRPIL.BUTTONS_TABLE.ROW[0].aCOL0} mapped to ${xml.VIRPIL.BUTTONS_TABLE.ROW[0].aCOL1}`);

    }



    public async getWindowState() {
        return await this.currWindow.getWindowState();
    }

    private async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}

new JoyMap();