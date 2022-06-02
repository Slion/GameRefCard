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

        Log.d(`Base: -${this.iBase}-`);
        Log.d(`Grip: -${this.iGrip}-`);
        Log.d(`Side: -${this.iSide}-`);
        Log.d(`VID: -${this.iVendorId}-`);
        Log.d(`PID: -${this.iProductId}-`);


        // Build hardware key
        this.iKey = `${this.iBase}.${this.iGrip}.${this.iSide}`;

        // Build friendly name
        this.iName = this.iBase.substr(this.iBase.match("VPC ").index + 4);
        this.iName += ' ' + this.iGrip.substr(this.iGrip.match("VPC ").index + 4);
        this.iName += ` - ${this.iSide}`;
    }
}
