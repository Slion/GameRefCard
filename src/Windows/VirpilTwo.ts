import { Virpil } from "./Virpil";

/**
 */
export class VirpilTwo extends Virpil {

    constructor() {
        // Just load Virpil profile at index 1
        super(1)
    }
}

new VirpilTwo();