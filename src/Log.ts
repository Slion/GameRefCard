
import { DateTime } from "luxon";

/**
 * 
 */
export class Log {
    public static d(aObject: any) {
        if (typeof aObject === 'string' || aObject instanceof String) {
            // Our object is a string just log on one line
            console.log(this.date() + " : " + aObject);
        } else {
            // Our object is not a string log its type and then itself
            console.log(this.date() + " : " + typeof aObject);
            console.log(aObject);
        }
    }

    public static obj(aText: string, aObject: any) {        
        console.log(this.date() + " : " + aText + " : " + JSON.stringify(aObject));
        console.log(aObject);
    }

    /**
     * Provide formatted date for our logs.
     */
    public static date(): string {
        //Date.now().toString()
        return DateTime.now().toFormat("yyyy-mm-dd hh:mm:ss.u");
    }
}