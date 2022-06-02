


export class Device {
    iVendorID: string;
    iProductID: string;
    // HTML Stuff
    iLogicalToLabel = new Map<string, Element>();
    iRemapToLabel = new Map<string, Element>();
}