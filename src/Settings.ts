import { JsonObject, JsonProperty, JsonSerializer } from "typescript-json-serializer";
import { Utils } from "./Utils";
import { VirpilProfile } from "./VirpilProfile";


@JsonObject()
export class Settings {


    // Persisted Virpil profiles 
    @JsonProperty({ type: VirpilProfile })
    iVirpilProfiles: VirpilProfile[] = new Array();

    // Persisted last directory from which we loaded a profile
    @JsonProperty()
    iProfileDir: string = `${overwolf.io.paths.localAppData}\\Slions\\GameRefCard`;

    @JsonProperty()
    iMechWarriorFiveHotasRemap: string = `${overwolf.io.paths.localAppData}\\MW5Mercs\\Saved\\SavedHOTAS\\HOTASMappings.Remap`;

    @JsonProperty()
    iMechWarriorFiveUserSettings: string = `${overwolf.io.paths.localAppData}\\MW5Mercs\\Saved\\Config\\WindowsNoEditor\\GameUserSettings.ini`;

    @JsonProperty()
    iShowHardwareIds: boolean = false;

    @JsonProperty()
    iShowLogicalIds: boolean = true;

    /**
    * Define path to persisted settings JSON file.
    */
    static get FileName(): string { return `${overwolf.io.paths.localAppData}\\Slions\\GameRefCard\\Settings.json`; }

    /**
     * Persist our settings into a file
     */
    Save() {
        const serializer = new JsonSerializer();
        Utils.WriteFile(Settings.FileName, JSON.stringify(serializer.serialize(this)));
    }

    /**
     * Try load persisted settings if any.
     */
    static async Load(): Promise<Settings> {

        let res = await Utils.ReadFile(Settings.FileName);
        if (res.success) {
            const serializer = new JsonSerializer();
            let settings: Settings = serializer.deserializeObject(res.content, Settings);
            return settings;
        }

        return new Settings();
    }

}

