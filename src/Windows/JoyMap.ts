import { OWWindow } from "@overwolf/overwolf-api-ts";
import { XMLParser } from "fast-xml-parser";
import { KHardware } from "../Hardware";
import { Log } from "../Log";
import { WindowName } from "../WindowName";
//import { XMLParser, XMLBuilder, XMLValidator } = require("../src/fxp");

// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared across the desktop and in-game windows.
export class JoyMap {
    protected currWindow: OWWindow;
    protected mainWindow: OWWindow;
    protected maximized: boolean = false;
    protected iMain: HTMLElement = document.getElementsByTagName('main')[0];

    constructor() {
        this.mainWindow = new OWWindow(WindowName.Application);
        this.currWindow = new OWWindow(WindowName.JoyMap);

        
        //const closeButton = document.getElementById('closeButton');
        //const maximizeButton = document.getElementById('maximizeButton');
        //const minimizeButton = document.getElementById('minimizeButton');

        //const header = document.getElementById('header');

        //this.setDrag(header);

        //closeButton.addEventListener('click', () => {
        //    this.mainWindow.close();
        //});

        //minimizeButton.addEventListener('click', () => {
        //    this.currWindow.minimize();
        //});

        //maximizeButton.addEventListener('click', () => {
        //    if (!this.maximized) {
        //        this.currWindow.maximize();
        //    } else {
        //        this.currWindow.restore();
        //    }

        //    this.maximized = !this.maximized;
        //});        

        let vpcAlphaLeft = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Virpil\\Profiles\\alpha-warbrd-left-03EB-9901.XML';
        let vpcAlphaRight = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Virpil\\Profiles\\alpha-warbrd-right-03EB-9902.XML';
        this.LoadVirpilProfile(vpcAlphaLeft);
        this.LoadVirpilProfile(vpcAlphaRight);

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
    public async LoadVirpilProfile(aFileName: string) {
        //let dir = `${overwolf.io.paths.localAppData}\\Slions\\JoyMap\\MyFile`;
        
        let result = await this.ReadFile(aFileName);
        Log.d(result);
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "i"
        };
        const parser = new XMLParser(options);

        let xml = parser.parse(result.content);
        Log.d(xml);

        Log.d(`Logical ${xml.VIRPIL.BUTTONS_TABLE.ROW[0].iCOL0} mapped to hardware ${xml.VIRPIL.BUTTONS_TABLE.ROW[0].iCOL1}`);


        let base = xml.VIRPIL.PROFILE.GroupBox_ProfileWizard.pfl_base.iData;
        let grip = xml.VIRPIL.PROFILE.GroupBox_ProfileWizard.pfl_grip.iData;
        let side = xml.VIRPIL.PROFILE.GroupBox_ProfileWizard.dev_side.iData;

        Log.d(`Base: ${base}`);
        Log.d(`Grip: ${grip}`);
        Log.d(`Side: ${side}`);

        // Build hardware key
        let key = `${base}.${grip}.${side}`;

        // Fetch our hardware definition
        let hwd = KHardware[key]
        Log.d(hwd);

        // Load our hardware image
        let img = new Image();
        img.src = hwd.image;
        //img.style.maxWidth = '100%';
        //img.style.maxHeight = '100%';

        // Prepare a canvas to draw our references
        var canvas = document.createElement('canvas');
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';

        // TODO: Not convinced that's needed
        let logicalButtons = Array();

        //
        img.onload = function () {

            //Log.d("Loaded!");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            let fontSizeInPixels = 48;
            ctx.font = `${fontSizeInPixels}px Arial`;
            ctx.fillStyle = "#000000";

            // For each buttons
            xml.VIRPIL.BUTTONS_TABLE.ROW.forEach(row => {
                let hardwareButton = parseInt(row.iCOL1);
                // Make sure that hardware button is valid
                if (hardwareButton) {
                    // If we have a valid hardware button
                    let btnKey = 'Joy_' + hardwareButton;
                    
                    //Log.d(row.iCOL1);
                    //Log.d(btnKey);
                    let btn = hwd[btnKey];
                    // Work out the logical button this hardware button was mapped to and display it

                    let logicalButton = parseInt(row.iCOL0.substring('Button '.length));
                    logicalButtons[logicalButton] = btn;

                    ctx.fillText(logicalButton.toString(), btn.x, btn.y + fontSizeInPixels);
                }
            });                       
        };

        // Add our canvas to our document
        this.iMain.appendChild(canvas);       
    }



    public async getWindowState() {
        return await this.currWindow.getWindowState();
    }

    private async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}

new JoyMap();