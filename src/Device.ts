


export class Device {
    iVendorID: string;
    iProductID: string;
    iTemplate: object;
    // Object used to map logical axes and buttons to reference card items
    iLogicalMap: any; // TODO: remove
    iLabels: Object = new Object(); // TODO: remove
    iCanvas: HTMLCanvasElement; // TODO: remove
    iContext: CanvasRenderingContext2D; // TODO: remove
    iLogicalToLabel = new Map<string, Element>();
    iRemapToLabel = new Map<string, Element>();
}