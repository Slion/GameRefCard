import { XMLParser } from "fast-xml-parser";
import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { Log } from "./Log";
import { Utils } from "./Utils";


@JsonObject()
export class VirpilProfile {

    @JsonProperty()
    public iFileName: string;
    public iXml: any;
    public iKey: string;
    public iBase: string;
    public iGrip: string;
    public iSide: string;
    public iVendorId: string;
    public iProductId: string;
    public iName: string;

    constructor(aFileName: string) {
        this.iFileName = aFileName;
    }

    

    async LoadProfile() {

        let result = await Utils.ReadFile(this.iFileName);
        Log.d(result);
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "i"
        };
        const parser = new XMLParser(options);

        this.iXml = parser.parse(result.content);
        Log.d(this.iXml);

        //Log.d(`Logical ${this.iXml.VIRPIL.BUTTONS_TABLE.ROW[0].iCOL0} mapped to hardware ${this.iXml.VIRPIL.BUTTONS_TABLE.ROW[0].iCOL1}`);


        this.iBase = this.iXml.VIRPIL.PROFILE.GroupBox_ProfileWizard.pfl_base.iData;
        this.iGrip = this.iXml.VIRPIL.PROFILE.GroupBox_ProfileWizard.pfl_grip.iData;
        this.iSide = this.iXml.VIRPIL.PROFILE.GroupBox_ProfileWizard.dev_side.iData;

        this.iVendorId = this.iXml.VIRPIL.PROFILE.GroupBox_ProfileUSB.dev_vid.iData;
        this.iProductId = this.iXml.VIRPIL.PROFILE.GroupBox_ProfileUSB.dev_pid.iData;

        Log.d(`Base: ${this.iBase}`);
        Log.d(`Grip: ${this.iGrip}`);
        Log.d(`Side: ${this.iSide}`);

        // Build hardware key
        this.iKey = `${this.iBase}.${this.iGrip}.${this.iSide}`;

        // Build friendly name
        this.iName = this.iBase.substr(this.iBase.match("VPC ").index + 4);
        this.iName += ' ' + this.iGrip.substr(this.iGrip.match("VPC ").index + 4);
        this.iName += ` - ${this.iSide}`;

        /*
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
        this.iXml.VIRPIL.BUTTONS_TABLE.ROW.forEach(row => {
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
        this.iXml.VIRPIL.AXES_TABLE.ROW.forEach(row => {

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
        */

    }

}