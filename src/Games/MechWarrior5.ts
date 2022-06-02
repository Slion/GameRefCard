import { Log } from "../Log";
import { Adapter } from "./Adapter";
import { Device } from "../Device";
import { Utils } from "../Utils";
import { RefCard } from "../Windows/RefCard";


/**
 * 
 */
export class MechWarrior5 extends Adapter {

    iActionKeyMap: any;

    iRefCard: RefCard = null;

    constructor() {
        super()
        Log.d("Games.MechWarrior5 constructor");
    }


    async BuildRefCard(aRefCard: RefCard) {

        this.iRefCard = aRefCard;

        //TODO; move game specific stuff elsewhere

        //Log.obj("Devices: ", this.iDevices);
        //let mwRemap = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\HOTASMappings.Remap';
        await this.LoadMechWarriorRemap(this.Settings.iMechWarriorFiveHotasRemap);

        //let mwUserSettings = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\GameUserSettings.ini';
        await this.LoadMechWarriorGameUserSettings(this.Settings.iMechWarriorFiveUserSettings);

    }

    /*
    async DoBuildRefCard(aRefCard: RefCard) {

        this.iRefCard = aRefCard;

        //TODO; move game specific stuff elsewhere

        //Log.obj("Devices: ", this.iDevices);
        //let mwRemap = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\HOTASMappings.Remap';
        await this.LoadMechWarriorRemap(this.Settings.iMechWarriorFiveHotasRemap);

        //let mwUserSettings = 'C:\\Dev\\GitHub\\Slion\\Gaming\\Games\\MW5\\DualAlphaWarBRD\\GameUserSettings.ini';
        await this.LoadMechWarriorGameUserSettings(this.Settings.iMechWarriorFiveUserSettings);
    }
    */

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

        for (let i = aIndex + 1; i < aChars.length; i++) {
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
                // Check if that axis is on any of our devices
                this.iRefCard.iDevices.forEach(d => {
                    if (d.iRemapToLabel.has(axis.Key)) {
                        // Yes it is, show it's name then
                        let label = d.iRemapToLabel.get(axis.Key);
                        let prints = Utils.FormatActionName(axis.AxisName, 0);
                        label.innerHTML += "  " + prints;
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
                    this.iRefCard.iDevices.forEach(d => {
                        // Yes it is, display its action then
                        if (d.iRemapToLabel.has(key.Key)) {
                            let label = d.iRemapToLabel.get(key.Key);
                            let prints = Utils.FormatActionName(action.ActionName, 0);
                            label.innerHTML += "  " + prints;
                        }
                    });
                })
            }
        })
    }


    /**
     * Parse MW5 joystick remap file.
     * That file maps logical device features to user settings ones.
     */
    public async LoadMechWarriorRemap(aFileName: string) {
        //let dir = `${overwolf.io.paths.localAppData}\\Slions\\JoyMap\\MyFile`;

        // VIRPIL Windows axes to MW5 InAxis map
        const KAxesMap = {
            'HOTAS_XAxis': 'X',
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
                    
                    //HTML stuff
                    let label = device.iLogicalToLabel.get(inButton.toString());
                    if (label) {
                        device.iRemapToLabel.set(outButtons, label);
                        if (this.Settings.iShowDebugInfo) {
                            // Use this to display the GameUserSettings button we map to
                            label.innerHTML += outButtons;
                        }
                    }

                } else if (line.startsWith(KAxis)) {
                    let split = line.substr(KAxis.length).trim().split(',');

                    // InAxis, assuming this is the first on our line
                    let inAxis = split[0].split('=')[1];
                    // OutAxis, assuming this is the second on our line
                    let outAxis = split[1].split('=')[1];
                    // Check if we know that axis
                    if (KAxesMap.hasOwnProperty(inAxis)) {                        
                        // That's an axis we know then, get the ref card item for it
                        //HTML stuff
                        let label = device.iLogicalToLabel.get(KAxesMap[inAxis]);
                        if (label) {
                            device.iRemapToLabel.set(outAxis, label);
                            if (this.Settings.iShowDebugInfo) {
                                // Use this to display the GameUserSettings axis we map to
                                label.innerHTML += outAxis;
                            }
                        }
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
                this.iRefCard.iDevices.every(d => {
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


}