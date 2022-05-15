


export class Device {
    iVendorID: string;
    iProductID: string;
    iTemplate: object;
    // Object used to map logical axes and buttons to reference card items
    iLogicalMap: any;
    iLabels: Object = new Object();//Map<string, any>;
    iCanvas: HTMLCanvasElement;
    iContext: CanvasRenderingContext2D;
}