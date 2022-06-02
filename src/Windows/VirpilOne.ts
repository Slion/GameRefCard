import { OWWindow } from "@overwolf/overwolf-api-ts";
import { Virpil } from "./Virpil";


/**
 * 
 */
export class VirpilOne extends Virpil {

    constructor() {
        // Just load Virpil profile at index 0
        super(0)  
    }
}

new VirpilOne();