import { OWWindow } from "@overwolf/overwolf-api-ts";
import { XMLParser } from "fast-xml-parser";
import { Device } from "../Device";
import { KHardware } from "../Hardware";
import { Log } from "../Log";
import { Utils } from "../Utils";
import { VirpilProfile } from "../VirpilProfile";
import { WindowName } from "../WindowName";

//import '@material/theme/dist/mdc.theme.css';

//import { XMLParser, XMLBuilder, XMLValidator } = require("../src/fxp");



// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared across the desktop and in-game windows.
export class Settings {
    currWindow: OWWindow;
    mainWindow: OWWindow;
    iWindowMW5 = new OWWindow(WindowName.MW5);
    maximized: boolean = false;
    iMain: HTMLElement = document.getElementsByTagName('main')[0];
    iButtonCreateRefCard = document.getElementById('iButtonCreateRefCard');
    iButtonVirpilProfileAdd = document.getElementById('iButtonVirpilProfileAdd');
    iListVirpilProfile = document.getElementById('iListVirpilProfile');
    

    iDevices = new Array<Device>();
    iFontSizeInPixels = 46;   
    iActionKeyMap: any;

    constructor() {
        this.mainWindow = new OWWindow(WindowName.Application);
        this.currWindow = new OWWindow(WindowName.Settings);
        

        let virpilProfilePath = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Virpil\\Profiles\\';

        this.iButtonVirpilProfileAdd.addEventListener('click', () => {
            //overwolf.io.paths
            overwolf.utils.openFilePicker('*.XML', virpilProfilePath, async (aRes) => {
                if (!aRes.success) {
                    return;
                }

                let vp = new VirpilProfile(aRes.file);
                await vp.LoadProfile();
                this.AddProfile(vp);

            }, false);
        });      

        this.iButtonCreateRefCard.addEventListener('click', () => {
            // Just show our reference card then
            this.iWindowMW5.restore();
        });

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


        //this.Construct();
        

    }


    AddProfile(aProfile: VirpilProfile) {
        // Do not use innerHTML += as it will break previous items onclick binding
        this.iListVirpilProfile.insertAdjacentHTML("beforeend",
            "<li id='" + aProfile.iKey + "' class='mdc-list-item mdc-list-item--with-two-lines'>" +
            "<span class= 'mdc-list-item__ripple' > </span>" +
            "<span class='mdc-list-item__text' > " +
            "<span class= 'mdc-list-item__primary-text' > " + aProfile.iName + "</span>" +
            "<span class= 'mdc-list-item__secondary-text'>" + ` ${aProfile.iVendorId} / ${aProfile.iProductId}` + "</span > " +
            "</span>" +
            "</li > ");
        //this.iListSources.innerHTML += "<li onclick='" + this.sourceClicked + ".call(this.id)' id='" + aSource.Address + "' class='mdc-list-item'><span class='mdc-list-item__ripple'></span><span class='mdc-list-item__text'>" + aSource.Name + " (" + aSource.Address + ")</span></li>";
        //document.getElementById(aSource.Address).style.color = 'red';
        document.getElementById(aProfile.iKey).onclick = () => { /* Could do something*/ };
    }


    /**
     * Asynchronous constructor
     */
    async Construct() {

        let vpcAlphaLeft = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Virpil\\Profiles\\alpha-warbrd-left-03EB-9901.XML';        
        await this.LoadVirpilProfile(vpcAlphaLeft);

        let vpcAlphaRight = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Virpil\\Profiles\\alpha-warbrd-right-03EB-9902.XML';
        await this.LoadVirpilProfile(vpcAlphaRight);

        // Set action name text color
        this.iDevices.forEach(d => {
            d.iContext.fillStyle = "#0000FF";
        });

        //Log.obj("Devices: ", this.iDevices);
        let mwRemap = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\HOTASMappings.Remap';
        await this.LoadMechWarriorRemap(mwRemap);

        let mwUserSettings = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\GameUserSettings.ini';
        await this.LoadMechWarriorGameUserSettings(mwUserSettings);



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
     * Convert weird action key map format into JSON so that we can parse it.
     * 
     * @param aData
     */
    ParseActionKeyMap(aData: string) {

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

        // Change first and last brackets
        chars[0] = '[';
        chars[chars.length - 1] = ']';


        aData = chars.join('');

        aData = aData.replace(/\(/g, "{");
        aData = aData.replace(/\)/g, "}");
        aData = aData.replace(/=/g, ":");

        Log.d(aData);

        return JSON.parse(aData);
    }

    /**
     * Load our action key map from MW5 GameUserSettings.ini
     * 
     * @param aFileName
     */
    public async LoadMechWarriorGameUserSettings(aFileName: string) {
        // InputTypeToActionKeyMap


        let result = await Utils.ReadFile(aFileName);
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
            } else if (line.startsWith("InputTypeToAxisKeyList")) {
                let lineData = line.substr("InputTypeToAxisKeyList=".length).trim();
                // Turn that line into JSON
                // Should only replace first and last bracket really as they are the only ones
                lineData = lineData.replace(/\(/g, "{");
                lineData = lineData.replace(/\)/g, "}");
                // Replace '=' with ':'
                lineData = lineData.replace(/=/g, ":");
                // Add quote everywhere        
                lineData = lineData.replace(/"/g, ""); // First remove all quotes
                lineData = lineData.replace(/([^:,\}\{]+)/g, "\"$1\""); // Then add them back
                Log.d(lineData);
                // 
                let axis = JSON.parse(lineData);                
                // Check if that key is on any of our devices
                this.iDevices.forEach(d => {
                    if (d.iLabels.hasOwnProperty(axis.Key)) {
                        let rci = d.iLabels[axis.Key]; // RCI = ref card item
                        let prints = Utils.FormatActionName(axis.AxisName, rci.labelCount);
                        d.iContext.fillText(prints, rci.x + rci.offsetX, rci.y + this.iFontSizeInPixels);
                        // Offset our text cursor
                        rci.offsetX += d.iContext.measureText(prints).width;
                        rci.labelCount++;
                    }
                });
            }

            // Try next line
            return true;
        });

        this.iActionKeyMap = this.ParseActionKeyMap(actionKeyMap);
        Log.obj("ActionKeyMap", this.iActionKeyMap);

        this.iActionKeyMap[2].Joystick.ActionKeyMaps.forEach(action => {
            if (action.hasOwnProperty("BoundedKeys")) {
                action.BoundedKeys.forEach(key => {
                    // Check if that key is on any of our devices
                    this.iDevices.forEach(d => {
                        if (d.iLabels.hasOwnProperty(key.Key)) {
                            let rci = d.iLabels[key.Key];
                            let prints = Utils.FormatActionName(action.ActionName, rci.labelCount);
                            d.iContext.fillText(prints, rci.x + rci.offsetX, rci.y + this.iFontSizeInPixels);
                            // Offset our text cursor
                            rci.offsetX += d.iContext.measureText(prints).width;
                            rci.labelCount++;
                        }
                    });                    
                })
            }
        })
    }


    /**
     * Parse MW5 joystick remap file.
     */
    public async LoadMechWarriorRemap(aFileName: string) {
        //let dir = `${overwolf.io.paths.localAppData}\\Slions\\JoyMap\\MyFile`;

        // VIRPIL Windows axes to MW5 InAxis map
        const KAxesMap = {
            'HOTAS_XAxis' : 'X',
            'HOTAS_YAxis': 'Y',
            'HOTAS_ZAxis': 'Z',
            'GenericUSBController_Axis3': 'rX',
            'GenericUSBController_Axis4': 'rY',
            'HOTAS_RZAxis': 'rZ',
            'GenericUSBController_Axis1': 'Slider', // Not sure about that on
            'GenericUSBController_Axis2': 'Dial' // Not tested this pure guess
        }

        let result = await Utils.ReadFile(aFileName);
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
                const KButton = "BUTTON:";
                const KAxis = "AXIS:";
                if (line.startsWith(KButton)) {
                    let split = line.substr(KButton.length).trim().split(',');
                    // InButton, assuming this is the first on our line
                    let inButton = parseInt(split[0].split('=')[1].substr('GenericUSBController_Button'.length));
                    // OutButtons, assuming this is the second on our line
                    let outButtons = split[1].split('=')[1];
                    Log.d("outButtons: " + outButtons);
                    Log.d("inButton: " + inButton);
                    //
                    let btn = device.iLogicalMap[inButton];
                    Log.obj("Button: ", btn);

                    btn.Key = outButtons;

                    // Build our label map
                    device.iLabels[outButtons] = btn;

                    // Use this to display the GameUserSettings button we map to
                    //device.iContext.fillText(outButtons, btn.x + btn.offsetX, btn.y + this.iFontSizeInPixels);
                } else if (line.startsWith(KAxis)) {
                    let split = line.substr(KAxis.length).trim().split(',');

                    // InAxis, assuming this is the first on our line
                    let inAxis = split[0].split('=')[1];
                    // OutAxis, assuming this is the second on our line
                    let outAxis = split[1].split('=')[1];
                    // Check if we know that axis
                    if (KAxesMap.hasOwnProperty(inAxis)) {
                        // That's an axis we know then, get the ref card item for it
                        let refCardItem = device.iLogicalMap[KAxesMap[inAxis]];
                        refCardItem.Key = outAxis;
                        // Build our map
                        device.iLabels[outAxis] = refCardItem;
                        // Use this to display the GameUserSettings axis we map to
                        //device.iContext.fillText(outAxis, refCardItem.x + refCardItem.offsetX, refCardItem.y + this.iFontSizeInPixels);
                    }
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
     * Load VPC profile from specified XML file.
     */
    public async LoadVirpilProfile(aFileName: string) {
        //let dir = `${overwolf.io.paths.localAppData}\\Slions\\JoyMap\\MyFile`;
        
        let result = await Utils.ReadFile(aFileName);
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

        // Object used to map logical axes and buttons to reference card items
        let logicalMap = new Object();
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
            // COL1 is the hardware button
            let hardwareButton = parseInt(row.iCOL1);
            // Make sure that hardware button is valid
            if (hardwareButton) {
                // If we have a valid hardware button
                let btnKey = 'Joy_' + hardwareButton;
                    
                //Log.d(row.iCOL1);
                //Log.d(btnKey);
                let rci = hwd[btnKey];
                // Work out the logical button this hardware button was mapped to and display it
                // COL0 is the logical button
                let logicalButton = parseInt(row.iCOL0.substring('Button '.length));
                logicalMap[logicalButton] = rci;

                // Display our logical button codes
                ctx.fillText(logicalButton.toString(), rci.x, rci.y + this.iFontSizeInPixels);
                rci.offsetX = 80;
                rci.labelCount = 0;
            }
        });

        // For each axis
        xml.VIRPIL.AXES_TABLE.ROW.forEach(row => {

            // COL4 is the source
            // COL5 is the port
            // COL6 is the sub.port
            // Together they form our axis hardware ID
            let hwId = `${row.iCOL4}_${row.iCOL5}_${row.iCOL6}`;

            // COL1 is the windows logical axis this axis is mapped too
            // Possible values are: X, Y, Z, rX, rY, rZ, Slider and Dial
            let logicalAxisName = row.iCOL1;

            // Make sure that axis is valid by checking if it has a valid port
            let hwPort = parseInt(row.iCOL5);
           
            // Make sure that hardware button is valid
            if (hwPort) {
                // If we have a valid axis
                // Fetch axis ref card item
                let rci = hwd[hwId];
                // Work out the logical button this hardware button was mapped to and display it

                //let logicalButton = parseInt(row.iCOL0.substring('Button '.length));
                logicalMap[logicalAxisName] = rci;

                // Display our logical axis codes
                ctx.fillText(logicalAxisName, rci.x, rci.y + this.iFontSizeInPixels);
                rci.offsetX = 140;
                rci.labelCount = 0;
            }
        });
 
        // Add our canvas to our document
        this.iMain.appendChild(canvas);

        device.iLogicalMap = logicalMap;

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

new Settings();