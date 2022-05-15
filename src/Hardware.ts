
enum ControlType {
    Digital, // Typically a button
    Analogue // Typically an axes
}

/**
 */
export class RefCardItem {

    //iType: ControlType;
    constructor(
        public iName: string,
        public iX: number,
        public iY: number,
        public iWidth: number) { }
}

enum Axis {
    X = 0,
    Y = 1,
    Z = 2,
    rX = 3,
    rY = 4,
    rZ = 5,
    Slider = 6,
    Dial = 7
}


/**
 * 
 */
export class RefCardDevice {

    constructor(
        public iName: string,
        public iImageSrc: string,
        public iButtons: RefCardItem[] = new Array<RefCardItem>(),
        public iAxis: RefCardItem[] = new Array<RefCardItem>())
    {
    }
}


/**
 * Just an example of what a typed template list could look like.
 * Not currently actually used.
 */
export const KRefCardTemplates: Map<string, RefCardDevice> = new Map<string, RefCardDevice>([
    ['[FLIGHT BASE] VPC WarBRD.[FLIGHT GRIP] VPC Constellation ALPHA.LEFT',
        {
            iName: 'VPC Alpha Left',
            iImageSrc:  './img/vpc-alpha-left.jpg',
            iButtons: [
                { iName: "tata", iX: 3, iY: 2, iWidth: 100 },
                new RefCardItem("lala", 2, 3, 10),

            ],
            iAxis: [
                { iName: "toto", iX: 3, iY: 2, iWidth: 100 }
            ],
        }],
    ['[FLIGHT BASE] VPC WarBRD.[FLIGHT GRIP] VPC Constellation ALPHA.RIGHT',
        new RefCardDevice('VPC Alpha Right', './img/vpc-alpha-right.jpg')
    ],
]);


// Define coordinate for drawing control text
export const KHardware = {
    // Hardware key
    '[FLIGHT BASE] VPC WarBRD.[FLIGHT GRIP] VPC Constellation ALPHA.LEFT': {
        'displayName': 'VPC Alpha left',
        image: './img/vpc-alpha-left.jpg',
        'Joy_1': { 'Type': 'Digital', 'x': 2610, 'y': 810, 'width': 1180 }, // Flip Trigger first stage
        'Joy_2': { 'Type': 'Digital', 'x': 2610, 'y': 870, 'width': 1180 }, // Flip Trigger second stage
        'Joy_3': { 'Type': 'Digital', 'x': 2610, 'y': 1060, 'width': 1180 }, // Trigger first stage
        'Joy_4': { 'Type': 'Digital', 'x': 2610, 'y': 1120, 'width': 1180 }, // Trigger second stage
        'Joy_5': { 'Type': 'Digital', 'x': 2610, 'y': 630, 'width': 1180 }, // Mini - joystick push
        'Joy_6': { 'Type': 'Digital', 'x': 2610, 'y': 330, 'width': 1180 }, // Red button
            // 4 - way hat top
        'Joy_7': { 'Type': 'Digital', 'x': 120, 'y': 810, 'width': 1180 }, // Push
        'Joy_8': { 'Type': 'Digital', 'x': 120, 'y': 570, 'width': 1180 }, // Up
        'Joy_9': { 'Type': 'Digital', 'x': 120, 'y': 630, 'width': 1180 }, // Right
        'Joy_10': { 'Type': 'Digital', 'x': 120, 'y': 690, 'width': 1180 }, // Down
        'Joy_11': { 'Type': 'Digital', 'x': 120, 'y': 750, 'width': 1180 }, // Left
            // Black button
        'Joy_12': { 'Type': 'Digital', 'x': 120, 'y': 920, 'width': 1180 },
            // 4 - way hat bottom
        'Joy_13': { 'Type': 'Digital', 'x': 120, 'y': 1340, 'width': 1180 }, // Push
        'Joy_14': { 'Type': 'Digital', 'x': 120, 'y': 1100, 'width': 1180 }, // Up
        'Joy_15': { 'Type': 'Digital', 'x': 120, 'y': 1160, 'width': 1180 }, // Right
        'Joy_16': { 'Type': 'Digital', 'x': 120, 'y': 1220, 'width': 1180 }, // Down
        'Joy_17': { 'Type': 'Digital', 'x': 120, 'y': 1280, 'width': 1180 }, // Left
		    // 2 - way hat
        'Joy_18': { 'Type': 'Digital', 'x': 120, 'y': 450, 'width': 1180 }, // Push
        'Joy_19': { 'Type': 'Digital', 'x': 120, 'y': 330, 'width': 1180 }, // Up
        'Joy_20': { 'Type': 'Digital', 'x': 120, 'y': 390, 'width': 1180 }, // Down
            // Wheel
        'Joy_21': { 'Type': 'Digital', 'x': 120, 'y': 1690, 'width': 1180 }, // Push second stage
        'Joy_22': { 'Type': 'Digital', 'x': 120, 'y': 1630, 'width': 1180 }, // Push first stage
        'Joy_23': { 'Type': 'Digital', 'x': 120, 'y': 1570, 'width': 1180 }, // Down
        'Joy_24': { 'Type': 'Digital', 'x': 120, 'y': 1510, 'width': 1180 }, // Up
            // Thumb hat
        'Joy_25': { 'Type': 'Digital', 'x': 2610, 'y': 1540, 'width': 1180 }, // Push
        'Joy_26': { 'Type': 'Digital', 'x': 2610, 'y': 1300, 'width': 1180 }, // Up
        'Joy_27': { 'Type': 'Digital', 'x': 2610, 'y': 1360, 'width': 1180 }, // Right
        'Joy_28': { 'Type': 'Digital', 'x': 2610, 'y': 1420, 'width': 1180 }, // Down
        'Joy_29': { 'Type': 'Digital', 'x': 2610, 'y': 1480, 'width': 1180 }, // Left
            // Pinky button
        'Joy_30': { 'Type': 'Digital', 'x': 2610, 'y': 1900, 'width': 1180 },
            // Break axis
        'Joy_31': { 'Type': 'Digital', 'x': 2610, 'y': 1750, 'width': 1180 },
        'Joy_UAxis': { 'Type': 'Analogue', 'x': 2610, 'y': 1690, 'width': 1180 },
            // Joystick axis
        'Joy_XAxis': { 'Type': 'Analogue', 'x': 120, 'y': 1860, 'width': 1180 },
        'Joy_YAxis': { 'Type': 'Analogue', 'x': 120, 'y': 1920, 'width': 1180 },
        'Joy_ZAxis': { 'Type': 'Analogue', 'x': 120, 'y': 1980, 'width': 1180 }, // Twist
		    // Mini - joysticks axis
        'Joy_RXAxis': { 'Type': 'Analogue', 'x': 2610, 'y': 510, 'width': 1180 },
        'Joy_RYAxis': { 'Type': 'Analogue', 'x': 2610, 'y': 570, 'width': 1180 },
    },

    '[FLIGHT BASE] VPC WarBRD.[FLIGHT GRIP] VPC Constellation ALPHA.RIGHT': {
        // VPC Alpha right
        'displayName': 'VPC Alpha right',
        image: './img/vpc-alpha-right.jpg',
        'Joy_1': { 'Type': 'Digital', 'x': 120, 'y': 810, 'width': 1180 }, // Flip Trigger first stage
        'Joy_2': { 'Type': 'Digital', 'x': 120, 'y': 870, 'width': 1180 }, // Flip Trigger second stage
        'Joy_3': { 'Type': 'Digital', 'x': 120, 'y': 1060, 'width': 1180 }, // Trigger first stage
        'Joy_4': { 'Type': 'Digital', 'x': 120, 'y': 1120, 'width': 1180 }, // Trigger second stage
        'Joy_5': { 'Type': 'Digital', 'x': 120, 'y': 630, 'width': 1180 }, // Mini - joystick push
            // Black button
        'Joy_6': { 'Type': 'Digital', 'x': 2610, 'y': 920, 'width': 1180 },
            // 4 - way hat bottom
        'Joy_7': { 'Type': 'Digital', 'x': 2610, 'y': 1340, 'width': 1180 }, // Push
        'Joy_8': { 'Type': 'Digital', 'x': 2610, 'y': 1100, 'width': 1180 }, // Up
        'Joy_9': { 'Type': 'Digital', 'x': 2610, 'y': 1160, 'width': 1180 }, // Right
        'Joy_10': { 'Type': 'Digital', 'x': 2610, 'y': 1220, 'width': 1180 }, // Down
        'Joy_11': { 'Type': 'Digital', 'x': 2610, 'y': 1280, 'width': 1180 }, // Left
            // Red button
        'Joy_12': { 'Type': 'Digital', 'x': 120, 'y': 330, 'width': 1180 },
            // 4 - way hat top
        'Joy_13': { 'Type': 'Digital', 'x': 2610, 'y': 740, 'width': 1180 }, // Push
        'Joy_14': { 'Type': 'Digital', 'x': 2610, 'y': 500, 'width': 1180 }, // Up
        'Joy_15': { 'Type': 'Digital', 'x': 2610, 'y': 560, 'width': 1180 }, // Right
        'Joy_16': { 'Type': 'Digital', 'x': 2610, 'y': 620, 'width': 1180 }, // Down
        'Joy_17': { 'Type': 'Digital', 'x': 2610, 'y': 680, 'width': 1180 }, // Left
		    // 2 - way hat
        'Joy_18': { 'Type': 'Digital', 'x': 2610, 'y': 330, 'width': 1180 }, // Push
        'Joy_19': { 'Type': 'Digital', 'x': 2610, 'y': 210, 'width': 1180 }, // Up
        'Joy_20': { 'Type': 'Digital', 'x': 2610, 'y': 270, 'width': 1180 }, // Down
            // Wheel
        'Joy_21': { 'Type': 'Digital', 'x': 2610, 'y': 1630, 'width': 1180 }, // Push first stage
        'Joy_22': { 'Type': 'Digital', 'x': 2610, 'y': 1690, 'width': 1180 }, // Push second stage
        'Joy_23': { 'Type': 'Digital', 'x': 2610, 'y': 1570, 'width': 1180 }, // Down
        'Joy_24': { 'Type': 'Digital', 'x': 2610, 'y': 1510, 'width': 1180 }, // Up
            // Thumb hat
        'Joy_25': { 'Type': 'Digital', 'x': 120, 'y': 1540, 'width': 1180 }, // Push
        'Joy_26': { 'Type': 'Digital', 'x': 120, 'y': 1300, 'width': 1180 }, // Up
        'Joy_27': { 'Type': 'Digital', 'x': 120, 'y': 1360, 'width': 1180 }, // Right
        'Joy_28': { 'Type': 'Digital', 'x': 120, 'y': 1420, 'width': 1180 }, // Down
        'Joy_29': { 'Type': 'Digital', 'x': 120, 'y': 1480, 'width': 1180 }, // Left
            // Pinky button
        'Joy_30': { 'Type': 'Digital', 'x': 120, 'y': 1900, 'width': 1180 },

            // Break axis
        'Joy_31': { 'Type': 'Digital', 'x': 120, 'y': 1750, 'width': 1180 },
        'Joy_UAxis': { 'Type': 'Analogue', 'x': 120, 'y': 1690, 'width': 1180 },
            // Joystick axis
        'Joy_XAxis': { 'Type': 'Analogue', 'x': 2610, 'y': 1860, 'width': 1180 },
        'Joy_YAxis': { 'Type': 'Analogue', 'x': 2610, 'y': 1920, 'width': 1180 },
        'Joy_ZAxis': { 'Type': 'Analogue', 'x': 2610, 'y': 1980, 'width': 1180 },
            // Mini - joysticks axis
        'Joy_RXAxis': { 'Type': 'Analogue', 'x': 120, 'y': 510, 'width': 1180 },
        'Joy_RYAxis': { 'Type': 'Analogue', 'x': 120, 'y': 570, 'width': 1180 },
    }
}
