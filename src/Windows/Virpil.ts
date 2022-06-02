import { parse } from "node-html-parser";
import { Device } from "../Device";
import { Log } from "../Log";
import { KTemplate } from "../Templates";
import { Utils } from "../Utils";
import { VirpilProfile } from "../VirpilProfile";
import { Game } from "./Game";

/**
 * Virpil window class.
 * Provide functionality common to all Virpil windows.
 */
export class Virpil extends Game {


    constructor(aProfileIndex: number) {
        super();
        Log.d("Window.Virpil constructor");

        this.Construct(aProfileIndex);
    }

    /**
     * 
     * @param aProfileIndex
     */
    async Construct(aProfileIndex: number) {
        if (aProfileIndex == -1) {
            // First load our Virpil profiles
            // TODO: not tested
            for (const vp of this.Settings.iVirpilProfiles) {
                await this.LoadVirpilProfile(vp);
            }
        } else {
            // Only load one profile then
            await this.LoadVirpilProfile(this.Settings.iVirpilProfiles[aProfileIndex]);
        }

        // Build our game specific reference card
        await this.Settings.iAdapter.BuildRefCard(this);
    }


    /**
     * Load Virpil profile into our ref card
     */
    public async LoadVirpilProfile(aProfile: VirpilProfile) {       

        let xml = aProfile.iXml;

        //Log.d(xml);

        // Load our HTML template matching the given profile
        let frag = await fetch(KTemplate[aProfile.iKey]);

        if (!frag.ok) {
            Log.d(`No template for Virpil profile: ${aProfile.iKey}`);
            return;
        }

        let contentId = `id-${aProfile.iProductId}-${aProfile.iVendorId}`;

        // Replace ID before parsing XML so that we can uniquely target each controller
        let html = parse((await frag.text()).replace("id=\"content\"", `id=\"${contentId}\"`));
        let content = html.getElementById(contentId);
        let script = html.getElementById('script');
        let style = html.getElementById('style');

        //this.iHead.insertAdjacentHTML("beforeend", script.outerHTML);
        this.iHead.insertAdjacentHTML("beforeend", style.outerHTML);
        this.iDivInsert.insertAdjacentHTML("beforeend", content.outerHTML);

        this.LinkLabelsToAnchors(contentId);

        let refCard = this.iDivInsert.querySelector(`#${contentId}`);


        let device = new Device();
        device.iVendorID = aProfile.iVendorId;
        device.iProductID = aProfile.iProductId;
     

        // For each buttons
        xml.VIRPIL.BUTTONS_TABLE.ROW.forEach(row => {
            // COL1 is the hardware button
            let hardwareButton = parseInt(row.iCOL1);
            // Make sure that hardware button is valid
            if (hardwareButton) {
                // If we have a valid hardware button
                //Log.d(row.iCOL1);

                // Work out the logical button this hardware button was mapped to and display it
                // COL0 is the logical button
                let logicalButton = parseInt(row.iCOL0.substring('Button '.length));

                let label = refCard.querySelector(`#label-button-${hardwareButton}`);

                if (!label) {
                    return;
                }

                // Keep track of the label for that button 
                device.iLogicalToLabel.set(logicalButton.toString(), label);     

                // Add hardware button label if needed
                if (this.Settings.iShowHardwareIds) {                    
                    // Pad with zeros
                    label.parentNode.insertBefore(Utils.CreateLabel(String(hardwareButton).padStart(2, '0')), label);
                }

                // Add logical button label if needed
                if (this.Settings.iShowLogicalIds) {
                    // Pad with zeros
                    label.parentNode.insertBefore(Utils.CreateLabel(String(logicalButton).padStart(2, '0')), label);
                }
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
                // Work out the logical button this hardware button was mapped to and display it

                // Add axis id as needed
                let label = refCard.querySelector(`#${hwId}`);

                if (!label) {
                    return;
                }

                // Keep track of the label for that axis
                device.iLogicalToLabel.set(logicalAxisName, label);

                // Display our logical axis codes and hardware axis id as specified by settings
                if (this.Settings.iShowHardwareIds) {
                    label.parentNode.insertBefore(Utils.CreateLabel(`${hwId}`), label);
                }

                if (this.Settings.iShowLogicalIds) {
                    label.parentNode.insertBefore(Utils.CreateLabel(`${logicalAxisName}`), label);
                }                
            }
        });

        this.iDevices.push(device);

        // Show device name as window title
        this.iTitle.innerText = aProfile.iName;
        if (this.Settings.iShowDebugInfo) {
            this.iTitle.innerText += ` - ${aProfile.iVendorId}:${aProfile.iProductId}`;
        }

    }


}


