import { OWWindow } from "@overwolf/overwolf-api-ts";
import { Virpil } from "./Virpil";


//import '@material/theme/dist/mdc.theme.css';

//import { XMLParser, XMLBuilder, XMLValidator } = require("../src/fxp");



// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared across the desktop and in-game windows.
export class MW5 extends Virpil {
    currWindow: OWWindow;
    mainWindow: OWWindow;
    maximized: boolean = false;    
        

    constructor() {

        super()

        
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

 
        //Log.obj('WTF', LeaderLine);



        window.addEventListener('load', () => {
            console.log("page is loaded")

            //Log.obj("Devices: ", this.iDevices);
            //this.LoadRemap(mwRemap);

            /*
            var iframes = document.querySelectorAll("iframe");
            for (var i = 0; i < iframes.length; i++) {
                //resizeIFrameToFitContent(iframes[i]);
                let content = iframes[i].contentWindow.document.getElementById('container');
                Log.obj('Content',content);
                this.iMain.appendChild(content);
            }*/

            //this.LinkLabelsToAnchors();

            this.UpdateLinksPositions();

        })


        window.addEventListener('resize', () => {
            console.log("page is resized")

            //Log.obj("Devices: ", this.iDevices);
            //this.LoadRemap(mwRemap);

            /*
            var iframes = document.querySelectorAll("iframe");
            for (var i = 0; i < iframes.length; i++) {
                //resizeIFrameToFitContent(iframes[i]);
                let content = iframes[i].contentWindow.document.getElementById('container');
                Log.obj('Content',content);
                this.iMain.appendChild(content);
            }*/

            //this.LinkLabelsToAnchors();

            this.UpdateLinksPositions();
        })

        this.iDivInsert.addEventListener('scroll', () => {
            console.log("on scroll")

            this.UpdateLinksPositions();
        })



        // Observer changes in our insert
        const config = { attributes: true, childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            this.UpdateLinksPositions();
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(this.iDivInsert, config);


        this.Construct();       
    }

    /**
     * Asynchronous constructor
     */
    async Construct() {

        // First load our Virpil profiles
        //for (const vp of this.Settings.iVirpilProfiles) {
        //    await this.LoadVirpilProfile(vp);
        //}

        // That window only loads our second profile
        await this.LoadVirpilProfile(this.Settings.iVirpilProfiles[1]);

        // Set action name text color
        this.iDevices.forEach(d => {
            d.iContext.fillStyle = "#0000FF";
        });

        //TODO; move game specific stuff elsewhere

        //Log.obj("Devices: ", this.iDevices);
        //let mwRemap = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\HOTASMappings.Remap';
        await this.LoadMechWarriorRemap(this.Settings.iMechWarriorFiveHotasRemap);

        //let mwUserSettings = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\GameUserSettings.ini';
        await this.LoadMechWarriorGameUserSettings(this.Settings.iMechWarriorFiveUserSettings);

    }






    public async getWindowState() {
        return await this.currWindow.getWindowState();
    }

    private async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}

new MW5();