import { OWWindow } from "@overwolf/overwolf-api-ts";
import { XMLParser } from "fast-xml-parser";
import { Device } from "../Device";
import { KHardware } from "../Hardware";
import { Log } from "../Log";
import { Utils } from "../Utils";
import { WindowName } from "../WindowName";
//import { XMLParser, XMLBuilder, XMLValidator } = require("../src/fxp");



// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared across the desktop and in-game windows.
export class JoyMap {
    currWindow: OWWindow;
    mainWindow: OWWindow;
    maximized: boolean = false;
    iMain: HTMLElement = document.getElementsByTagName('main')[0];

    iDevices = new Array<Device>();

    iFontSizeInPixels = 48;
    iLevel = 0;
    iActionKeyMap: Object = new Object();
    iChars: string[];
    //iCurrentObject: Object = null;

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

 




        window.addEventListener('load', () => {
            //console.log("page is loaded")

            //Log.obj("Devices: ", this.iDevices);
            //this.LoadRemap(mwRemap);
        })


        this.Construct();
        

    }

    /**
     * Asynchronous constructor
     */
    async Construct() {

        let vpcAlphaLeft = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Virpil\\Profiles\\alpha-warbrd-left-03EB-9901.XML';        
        await this.LoadVirpilProfile(vpcAlphaLeft);

        let vpcAlphaRight = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Virpil\\Profiles\\alpha-warbrd-right-03EB-9902.XML';
        await this.LoadVirpilProfile(vpcAlphaRight);


        // TODO: Find a way not to do that
        //await sleep(2000);


        //Log.obj("Devices: ", this.iDevices);
        let mwRemap = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\HOTASMappings.Remap';
        await this.LoadMechWarriorRemap(mwRemap);

        let mwUserSettings = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\GameUserSettings.ini';
        await this.LoadMechWarriorGameUserSettings(mwUserSettings);



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
     * 
     * 
     * @param aChars
     * @param aIndex
     * @param aReplacement
     */
    ReplaceMatchingBrackets(aChars: string[], aIndex: number, aBeginRep: string, aEndRep: string) {

        let level = 0;

        aChars[aIndex] = aBeginRep;

        for (let i = aIndex+1; i < aChars.length; i++) {
            if (aChars[i] == ')' && level == 0) {
                aChars[i] = aEndRep;
                return;
            } else if (aChars[i] == ')') {
                level--;
            } else if (aChars[i] == '(') {
                level++;
            }
        }

    }

    /**
     * 
     * @param aData
     */
    ParseActionKeyMap(aData: string, aObject: Object | Array<any>) {

        // Add quote everywhere        
        aData = aData.replace(/([\(,=])(\w+)([\),=])/g, "$1\"$2\"$3");
        // Not sure why those were needed as in theory all should have been taken care by the above alone
        aData = aData.replace(/([\(,=])(\w)([\),=])/g, "$1\"$2\"$3");
        aData = aData.replace(/(=)(\w+)(\))/g, "$1\"$2\"$3");
        aData = aData.replace(/(=)(\w+)(,)/g, "$1\"$2\"$3");
        
        //aData = aData.replace(/([\(,=])(\w+)([\(,=])/g, "$1\"$2\"$3");

        let chars = aData.split('');

        for (let i = 0; i < (chars.length - 3); i++) {
            // Spot our arrays and set them between square brackets
            if (chars[i] == 's' && chars[i + 1] == '"' && chars[i + 2] == '=' && chars[i + 3] == '(') {
                this.ReplaceMatchingBrackets(chars, i + 3, '[', ']');
            }
            // Spot our three main sections and set them between curly bracket
            else if (chars[i] == ',' && chars[i + 1] == ' ' && chars[i + 2] == '(') {
                this.ReplaceMatchingBrackets(chars, i + 2, '{', '}');
                // Also replace that coma with colon
                chars[i] = ':';
            }
        }

        // Remove first and last brackets
        chars[0] = '[';
        chars[chars.length - 1] = ']';


        aData = chars.join('');

        aData = aData.replace(/\(/g, "{");
        aData = aData.replace(/\)/g, "}");
        aData = aData.replace(/=/g, ":");

        //aData = aData.replace(/\)/g, "}");
        //aData = aData.replace(/\(/g, "{");
        

        /*
        
        aData = aData.replace(/\)/g, "}");
        
        */


        //aData = aData.replace(/[^"](\w+)[^"]/g,"\"$1\"");

        


        /*
        aActionKeyMap = aActionKeyMap.replace(/\)\s/g, "], ");
        aActionKeyMap = aActionKeyMap.replace(/\)/g, "]");
        aActionKeyMap = aActionKeyMap.replace(/\s+/, ", ");
        aActionKeyMap = "[" + aActionKeyMap + "]";
        aActionKeyMap = aActionKeyMap.replace(/[^\[\]\,\s]+/g, "\"$&\"");
        aActionKeyMap = aActionKeyMap.replace(/" /g, "\", ");
        */

        // Create JSON arrays
        //aActionKeyMap = aActionKeyMap.replace(/=\(\(/g, ":{");
        //aActionKeyMap = aActionKeyMap.replace(/\)\)\),/g, "}),");
        //aActionKeyMap = aActionKeyMap.replace(/\)\),/g, "},");

        // Quote all strings
        //aActionKeyMap = aActionKeyMap.replace(/\)\),/g, "},");

        //([]+)

        /*
        aData = aData.trim();

        if (aData[0] == '(') {
            this.iLevel++;

            if (Array.isArray(aObject)) {
                aObject.push(new );
                this.ParseActionKeyMap(aData.substr(1), aObject);
            } else {
                // Go down one level, remain on the same object I guess
                this.ParseActionKeyMap(aData.substr(1), aObject);
            }

            return;
        } else if (aData[0] == ')') {
            this.iLevel--;

            return;
        }

        let match = aData.match(/^(\w+),/)
        if (match != null) {
            // We have an object
            aObject[match[1]] = new Object();
            this.ParseActionKeyMap(aData.substr(match[0].length), aObject[match[1]]);
            return;
        }

        match = aData.match(/^(\w+)=\(/)
        if (match != null) {
            // We have an array
            this.iLevel++;
            aObject[match[1]] = new Array<any>();
            this.ParseActionKeyMap(aData.substr(match[0].length), aObject[match[1]]);
            return;
        }

        let obj = new Object();
        match = aData.match(/^(\w+)=\?"*(\w+)"*,/)        
        if (match != null) {
            // We have an array
            this.iLevel++;
            aObject[match[1]] = new Array<any>();
            this.ParseActionKeyMap(aData.substr(match[0].length), aObject[match[1]]);
            return;
        }
        */

        //Log.obj("match",aActionKeyMap.match(/\((.*)\)/)[1]);



        Log.d(aData);

        return JSON.parse(aData);
    }

    /**
     * 
     * @param aFileName
     */
    public async LoadMechWarriorGameUserSettings(aFileName: string) {
        // InputTypeToActionKeyMap


        let result = await this.ReadFile(aFileName);
        Log.d(result);
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "i"
        };
        var lines = result.content.split('\n');
        let actionKeyMap: string = "";

        lines.every(line => {
            if (line.startsWith("InputTypeToActionKeyMap")) {
                actionKeyMap = line.substr("InputTypeToActionKeyMap=".length).trim();
                // Break our loop
                return false;
            }

            // Try next line
            return true;
        });

        this.ParseActionKeyMap(actionKeyMap, this.iActionKeyMap);
        Log.obj("ActionKeyMap",this.iActionKeyMap);
    }

    /**
     * Parse MW5 joystick remap file.
     */
    public async LoadMechWarriorRemap(aFileName: string) {
        //let dir = `${overwolf.io.paths.localAppData}\\Slions\\JoyMap\\MyFile`;

        let result = await this.ReadFile(aFileName);
        Log.d(result);
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "i"
        };
        var lines = result.content.split('\n');

        let pid = "";
        let vid = "";
        let device: Device = null;
        let skipToNextDevice = false;


        lines.forEach(line => {

            Log.d("Line: " + line);

            if (line.startsWith("START_BIND")) {
                // Reset our device
                device = null;
                pid = "";
                vid = "";
                skipToNextDevice = false;
                return;
            }

            if (skipToNextDevice) {
                return;
            }

            if (device != null) {
                Log.obj("Device: ", device);
                // Deal with parsing once we got a device
                if (line.startsWith("BUTTON:")) {
                    let split = line.substr(7).trim().split(',');
                    // InButton
                    let inButton = parseInt(split[0].split('=')[1].substr('GenericUSBController_Button'.length));
                    // OutButtons
                    let outButtons = split[1].split('=')[1];
                    Log.d("outButtons: " + outButtons);
                    Log.d("inButton: " + inButton);
                    //
                    let btn = device.iLogicals[inButton];
                    Log.obj("Button: ", btn);

                    btn.Key = outButtons;

                    // Build our label map
                    device.iLabels[outButtons] = btn;

                    //var ctx = device.iCanvas.getContext('2d');                   
                    //ctx.font = `${this.iFontSizeInPixels}px Arial`;
                    //ctx.fillStyle = "#000000";
                    device.iContext.fillText(outButtons, btn.x + 80, btn.y + this.iFontSizeInPixels);
                }

                return;
            }

            // Extract VID
            if (line.startsWith("VID:")) {
                vid = line.substr(4).trim().substr(2); // Also remove 0x prefix
                Log.d("VID: " + vid);
            }

            // Extract PID
            if (line.startsWith("PID:")) {
                pid = line.substr(4).trim().substr(2); // Also remove 0x prefix
                Log.d("PID: " + pid);
            }

            if (pid != "" && vid != "") {
                Log.d("Got VID and PID");
                // We got both VID and PID, fetch corresponding device
                this.iDevices.every(d => {
                    Log.d("Check device");
                    Log.d(d);
                    if (d.iProductID == pid && d.iVendorID == vid) {
                        device = d;
                        // Stop iteration
                        Log.d("Found remap device");
                        return false;
                    }
                    
                    return true;
                });

                if (device == null) {
                    // We don't know that device skip to the next one
                    skipToNextDevice = true;
                }
            }


        });

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

        //Log.d(`Logical ${xml.VIRPIL.BUTTONS_TABLE.ROW[0].iCOL0} mapped to hardware ${xml.VIRPIL.BUTTONS_TABLE.ROW[0].iCOL1}`);


        let base = xml.VIRPIL.PROFILE.GroupBox_ProfileWizard.pfl_base.iData;
        let grip = xml.VIRPIL.PROFILE.GroupBox_ProfileWizard.pfl_grip.iData;
        let side = xml.VIRPIL.PROFILE.GroupBox_ProfileWizard.dev_side.iData;

        let vid = xml.VIRPIL.PROFILE.GroupBox_ProfileUSB.dev_vid.iData;
        let pid = xml.VIRPIL.PROFILE.GroupBox_ProfileUSB.dev_pid.iData;

        Log.d(`Base: ${base}`);
        Log.d(`Grip: ${grip}`);
        Log.d(`Side: ${side}`);

        // Build hardware key
        let key = `${base}.${grip}.${side}`;

        // Fetch our hardware definition
        let hwd = KHardware[key]
        Log.d(hwd);

        let device = new Device();
        device.iTemplate = hwd;
        device.iVendorID = vid;
        device.iProductID = pid;


        // Prepare a canvas to draw our references
        var canvas = document.createElement('canvas');
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        device.iCanvas = canvas;

        // TODO: Not convinced that's needed
        let logicalButtons = new Array();
        //logicalButtons[0] = 'Not used';      

        // Create our hardware image and wait for it to load
        let img = await Utils.LoadImage(hwd.image);
        
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        device.iContext = ctx;
        ctx.drawImage(img, 0, 0);            
        ctx.font = `${this.iFontSizeInPixels}px Arial`;
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

                ctx.fillText(logicalButton.toString(), btn.x, btn.y + this.iFontSizeInPixels);
            }
        });

 
        // Add our canvas to our document
        this.iMain.appendChild(canvas);

        device.iLogicals = logicalButtons;

        this.iDevices.push(device);

        //while (!loaded) {};
    }



    public async getWindowState() {
        return await this.currWindow.getWindowState();
    }

    private async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}

new JoyMap();