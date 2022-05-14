


export class Device {
    iVendorID: string;
    iProductID: string;
    iTemplate: object;
    iLogicals: any;
    iLabels: Object = new Object();//Map<string, any>;
    iCanvas: HTMLCanvasElement;
    iContext: CanvasRenderingContext2D;
}