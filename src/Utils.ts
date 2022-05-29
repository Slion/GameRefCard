


export class Utils {


    /**
     * Load an image from a given URL
     * @param {String} aUrl The URL of the image resource
     * @returns {Promise<HTMLImageElement>} The loaded image
     * 
     * From: https://stackoverflow.com/a/52060802/3969362
     */
    static LoadImage(aUrl): Promise<HTMLImageElement> {
        /*
         * We are going to return a Promise which, when we .then
         * will give us an Image that should be fully loaded
         */
        return new Promise(resolve => {

            /*
             * Create the image that we are going to use to
             * to hold the resource
             */
            const image = new Image();

            /*
             * The Image API deals in even listeners and callbacks
             * we attach a listener for the "load" event which fires
             * when the Image has finished the network request and
             * populated the Image with data
             */
            image.addEventListener('load', () => {
                /*
                 * You have to manually tell the Promise that you are
                 * done dealing with asynchronous stuff and you are ready
                 * for it to give anything that attached a callback
                 * through .then a realized value.  We do that by calling
                 * resolve and passing it the realized value
                 */
                resolve(image);
            });

            /*
             * Setting the Image.src is what starts the networking process
             * to populate an image.  After you set it, the browser fires
             * a request to get the resource.  We attached a load listener
             * which will be called once the request finishes and we have
             * image data
             */
            image.src = aUrl;
        });
    }


    /**
     * Try not to use that.
     * 
     * @param ms
     */
    static Sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 
     * @param aString
     */
    static ExpandCamelCase(aString: string): string {
        let res = aString.replace(/([^\s])([0-9]+)/g, "$1 $2");
        res = res.replace(/([^\s])([A-Z])/g, (a, p, s) => p + " " + s.toLowerCase());
        return res;
    }

    /**
     * 
     * @param aString
     */
    static FormatActionName(aString: string, aLabelCount: number): string {
        let res = Utils.ExpandCamelCase(aString);
        if (aLabelCount > 0) {
            return " - " + res;
        }
        //return "[ " + res + " ]";
        return res;
    }


    /**
     *
     * @param aPath
     */
    static async ReadFile(aPath: string): Promise<overwolf.io.ReadFileContentsResult> {
        //console.info(aPath);
        const result: overwolf.io.ReadFileContentsResult = await new Promise(resolve => {
            overwolf.io.readFileContents(
                aPath,
                overwolf.io.enums.eEncoding.UTF8,
                resolve
            );
        });

        return result;
    }

    /**
     *
     * @param aPath
     * @param aContent
     */
    static async WriteFile(aPath: string, aContent) {
        //console.log(aPath);
        //console.log(content);
        //;
        const result = await new Promise((resolve, reject) => {
            overwolf.io.writeFileContents(
                aPath,
                aContent,
                overwolf.io.enums.eEncoding.UTF8,
                true,
                r => r.success ? resolve(r) : reject(r)
            );
        });

        console.log('writeFile()', result);

        return result;
    }

    /**
     * 
     * @param aFileName
     */
    static Folder(aFileName: string) : string {
        return aFileName.substr(0, aFileName.lastIndexOf("\\") + 1);
    }

}
