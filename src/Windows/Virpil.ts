import { parse } from "node-html-parser";
import { AppWindow } from "../AppWindow";
import { Device } from "../Device";
import { KHardware } from "../Hardware";
import { Log } from "../Log";
import { Utils } from "../Utils";
import { VirpilProfile } from "../VirpilProfile";
import { Game } from "./Game";
import { RefCard } from "./RefCard";

/**
 * Virpil window class.
 * Provide functionality common to all Virpil windows.
 */
export class Virpil extends Game {


    constructor() {
        super();
        Log.d("Window.Virpil constructor");
    }


    /**
     * Load VPC profile from into our ref card
     */
    public async LoadVirpilProfile(aProfile: VirpilProfile) {
        //let dir = `${overwolf.io.paths.localAppData}\\Slions\\JoyMap\\MyFile`;

        let xml = aProfile.iXml;

        //Log.d(xml);

        //let frameDiv = document.createElement('div');
        //frameDiv.classList.add('frame-container');

        let frag = await fetch('VPC-Alpha-Left.html');

        if (!frag.ok) {
            return;
        }

        let contentId = `id-${aProfile.iProductId}-${aProfile.iVendorId}`;

        // Replace ID before parsing XML so that we can uniquely target each controller
        let html = parse((await frag.text()).replace("id=\"content\"", `id=\"${contentId}\"`));
        let content = html.getElementById(contentId);
        let script = html.getElementById('script');
        let style = html.getElementById('style');

        //content.id = aProfile.iProductId + aProfile.iVendorId;

        //let frame = <HTMLIFrameElement>document.createElement('iframe');
        //frame.src = 'VPC-Alpha-Left.html';

        //frameDiv.appendChild(frame);     

        //frame.width = '100%';
        //frame.height = '50%';

        //this.iHead.insertAdjacentHTML("beforeend", script.outerHTML);
        this.iHead.insertAdjacentHTML("beforeend", style.outerHTML);
        this.iDivInsert.insertAdjacentHTML("beforeend", content.outerHTML);

        this.LinkLabelsToAnchors(contentId);


        let refCard = this.iDivInsert.querySelector(`#${contentId}`);

        //this.iMain.appendChild(content);


        //iframeResizer({ log: true, sizeHeight: true }, frame);




        //let result = await Utils.ReadFile(aFileName);


        //Log.d(`Logical ${xml.VIRPIL.BUTTONS_TABLE.ROW[0].iCOL0} mapped to hardware ${xml.VIRPIL.BUTTONS_TABLE.ROW[0].iCOL1}`);



        // Fetch our hardware definition
        let hwd = KHardware[aProfile.iKey];
        Log.d(hwd);

        let device = new Device();
        device.iTemplate = hwd;
        device.iVendorID = aProfile.iVendorId;
        device.iProductID = aProfile.iProductId;


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
                let rci = hwd[btnKey]; // Ref Card Item
                // Work out the logical button this hardware button was mapped to and display it
                // COL0 is the logical button
                let logicalButton = parseInt(row.iCOL0.substring('Button '.length));
                logicalMap[logicalButton] = rci;

                let label = refCard.querySelector(`#label-button-${hardwareButton}`);

                if (!label) {
                    return;
                }

                // Keep track of the label for that button 
                device.iLogicalToLabel.set(logicalButton.toString(), label);

                // Remove default text
                label.innerHTML = "";

                // Add button id as needed
                if (this.Settings.iShowHardwareIds && this.Settings.iShowLogicalIds) {
                    label.innerHTML = `${hardwareButton} - ${logicalButton}  `;
                } else if (this.Settings.iShowHardwareIds) {
                    label.innerHTML = `${hardwareButton}  `;
                } else if (this.Settings.iShowLogicalIds) {
                    label.innerHTML = `${logicalButton}  `;
                }

                // Display our logical button codes
                //ctx.fillText(logicalButton.toString(), rci.x, rci.y + this.iFontSizeInPixels);
                // Display both hardware and logical button codes
                //ctx.fillText(hardwareButton.toString() + ":" + logicalButton.toString(), rci.x, rci.y + this.iFontSizeInPixels);
                // Display hardware button codes
                ctx.fillText(hardwareButton.toString(), rci.x, rci.y + this.iFontSizeInPixels);
                //
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

                // Add axis id as needed
                let label = refCard.querySelector(`#${hwId}`);

                if (!label) {
                    return;
                }

                // Keep track of the label for that axis
                device.iLogicalToLabel.set(logicalAxisName, label);


                if (this.Settings.iShowHardwareIds && this.Settings.iShowLogicalIds) {
                    label.innerHTML = `${hwId} - ${logicalAxisName}  `;
                } else if (this.Settings.iShowHardwareIds) {
                    label.innerHTML = `${hwId}  `;
                } else if (this.Settings.iShowLogicalIds) {
                    label.innerHTML = `${logicalAxisName}  `;
                }


                // Display our logical axis codes
                //ctx.fillText(logicalAxisName, rci.x, rci.y + this.iFontSizeInPixels);

                // Display our hardware axis id
                ctx.fillText(hwId, rci.x, rci.y + this.iFontSizeInPixels);

                rci.offsetX = 360;
                rci.labelCount = 0;
            }
        });

        // Add our canvas to our document
        this.iDivInsert.appendChild(canvas);

        device.iLogicalMap = logicalMap;

        this.iDevices.push(device);

        // Show device name as window title
        this.iTitle.innerText = aProfile.iName;
        if (this.Settings.iShowDebugInfo) {
            this.iTitle.innerText += ` - ${aProfile.iVendorId}:${aProfile.iProductId}`;
        }

    }


}


