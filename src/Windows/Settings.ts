import { OWWindow } from "@overwolf/overwolf-api-ts";
import { XMLParser } from "fast-xml-parser";
import { JsonObject, JsonProperty, JsonSerializer } from "typescript-json-serializer";
import { AppWindow } from "../AppWindow";
import { Device } from "../Device";
import { KHardware } from "../Hardware";
import { Log } from "../Log";
import { Utils } from "../Utils";
import { VirpilProfile } from "../VirpilProfile";
import { WindowName } from "../WindowName";
import { Base } from "./Base";
import { MDCSwitch } from '@material/switch';

//import '@material/theme/dist/mdc.theme.css';

//import { XMLParser, XMLBuilder, XMLValidator } = require("../src/fxp");

/**
 * 
 */
export class Settings extends Base {

    currWindow: OWWindow;
    mainWindow: OWWindow;
    maximized: boolean = false;
    iMain: HTMLElement = document.getElementsByTagName('main')[0];
    iButtonCreateRefCard = document.getElementById('iButtonCreateRefCard');
    iButtonVirpilProfileAdd = document.getElementById('iButtonVirpilProfileAdd');
    iButtonVirpilProfileClear = document.getElementById('iButtonVirpilProfileClear');
    iListVirpilProfile = document.getElementById('iListVirpilProfile');
    iTextMechWarriorFiveHotasRemap = document.getElementById('iTextMechWarriorFiveHotasRemap');
    iButtonMechWarriorFiveHotasRemap = document.getElementById('iButtonMechWarriorFiveHotasRemap');
    iTextMechWarriorFiveUserSettings = document.getElementById('iTextMechWarriorFiveUserSettings');
    iButtonMechWarriorFiveUserSettings = document.getElementById('iButtonMechWarriorFiveUserSettings');
    //
    iButtonShowLogicalIds = <HTMLButtonElement>document.getElementById('iButtonShowLogicalIds');
    iSwitchShowLogicalIds: MDCSwitch = null;
    //
    iButtonShowHardwareIds = <HTMLButtonElement>document.getElementById('iButtonShowHardwareIds');
    iSwitchShowHardwareIds: MDCSwitch = null;
    //
    iButtonShowDebugInfo = <HTMLButtonElement>document.getElementById('iButtonShowDebugInfo');
    iSwitchShowDebugInfo: MDCSwitch = null;

    

    
    iDevices = new Array<Device>();
    iFontSizeInPixels = 46;
    iActionKeyMap: any;


    constructor() {

        super();

        Log.d("Settings constructor");

        this.mainWindow = new OWWindow(WindowName.Application);
        this.currWindow = new OWWindow(WindowName.Settings);

        // Make sure our switches are functional
        this.iSwitchShowLogicalIds = new MDCSwitch(this.iButtonShowLogicalIds);
        this.iSwitchShowLogicalIds.selected = this.Settings.iShowLogicalIds;
        //this.iSwitchShowLogicalIds.listen("selected", () => { this.Settings.iShowLogicalIds = this.iSwitchShowLogicalIds.selected; this.Settings.Save(); })
        this.iSwitchShowHardwareIds = new MDCSwitch(this.iButtonShowHardwareIds);
        this.iSwitchShowHardwareIds.selected = this.Settings.iShowHardwareIds;
        //this.iSwitchShowHardwareIds.listen("selected", () => { console.log("toggle"); this.Settings.iShowHardwareIds = this.iSwitchShowHardwareIds.selected; this.Settings.Save(); })
        this.iSwitchShowDebugInfo = new MDCSwitch(this.iButtonShowDebugInfo);
        this.iSwitchShowDebugInfo.selected = this.Settings.iShowDebugInfo;
        //this.iSwitchShowHardwareIds.listen("selected", () => { console.log("toggle"); this.Settings.iShowHardwareIds = this.iSwitchShowHardwareIds.selected; this.Settings.Save(); })


        this.iButtonVirpilProfileAdd.addEventListener('click', () => {
            // Select an XML profile file
            overwolf.utils.openFilePicker('*.XML', this.Settings.iProfileDir, async (aRes) => {
                if (!aRes.success) {
                    return;
                }

                // Remember that folder
                this.Settings.iProfileDir = Utils.Folder(aRes.file);

                let vp = new VirpilProfile(aRes.file);
                this.Settings.iVirpilProfiles.push(vp);
                await vp.LoadProfile();
                this.AddProfile(vp);
                // Save our settings since we changed them
                this.Settings.Save();

            }, false);
        });


        this.iButtonVirpilProfileClear.addEventListener('click', () => {
            this.Settings.iVirpilProfiles.length = 0;
            this.iListVirpilProfile.innerHTML = "";
            // Save our settings since we changed them
            this.Settings.Save();
        });


        this.iButtonCreateRefCard.addEventListener('click', () => {

            // Save settings until we find away to get notified about it
            // See: https://github.com/material-components/material-components-web/issues/7628
            this.Settings.iShowLogicalIds = this.iSwitchShowLogicalIds.selected;
            this.Settings.iShowHardwareIds = this.iSwitchShowHardwareIds.selected;
            this.Settings.iShowDebugInfo = this.iSwitchShowDebugInfo.selected;
            this.Settings.Save();

            // Just show our reference card then
            this.iAppWindow.iWindowMW5.restore();
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


        this.iTextMechWarriorFiveHotasRemap.innerText = this.Settings.iMechWarriorFiveHotasRemap
        this.iButtonMechWarriorFiveHotasRemap.addEventListener('click', () => {
            overwolf.utils.openFilePicker('*.remap;*.Remap', Utils.Folder(this.Settings.iMechWarriorFiveHotasRemap), async (aRes) => {
                if (!aRes.success) {
                    return;
                }

                // Remember that folder
                //this.Settings.iProfileDir = aRes.file.substr(0, aRes.file.lastIndexOf("\\") + 1);
                this.Settings.iMechWarriorFiveHotasRemap = aRes.file;

                // Save our settings since we changed them
                this.Settings.Save();

                //
                this.iTextMechWarriorFiveHotasRemap.innerText = this.Settings.iMechWarriorFiveHotasRemap

            }, false);
        });

        this.iTextMechWarriorFiveUserSettings.innerText = this.Settings.iMechWarriorFiveUserSettings;
        this.iButtonMechWarriorFiveUserSettings.addEventListener('click', () => {
            overwolf.utils.openFilePicker('*.ini', Utils.Folder(this.Settings.iMechWarriorFiveUserSettings), async (aRes) => {
                if (!aRes.success) {
                    return;
                }

                // Remember that folder
                //this.Settings.iProfileDir = aRes.file.substr(0, aRes.file.lastIndexOf("\\") + 1);
                this.Settings.iMechWarriorFiveUserSettings = aRes.file;

                // Save our settings since we changed them
                this.Settings.Save();
                //
                this.iTextMechWarriorFiveUserSettings.innerText = this.Settings.iMechWarriorFiveUserSettings;

            }, false);
        });



        this.Construct();


    }



    /**
        * Add the given profile to our list box.
        * @param aProfile
        */
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

        document.getElementById(aProfile.iKey).onclick = () => { /* Could do something, display that profile properties */ };
    }


    /**
     * Load Virpil profiles and populate our list box after internalizing our settings.
     */
    async Construct() {
        for (const vp of this.Settings.iVirpilProfiles) {
            await vp.LoadProfile();
            this.AddProfile(vp);
        }
    }

}



new Settings();

    
