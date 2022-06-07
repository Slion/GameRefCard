import { Device } from "../Device";
import { Log } from "../Log";
import { Base } from "../Base";
import { LeaderLine } from '../Libs/LeaderLine';

/**
 * Reference card window class.
 * Provide functionality common to all reference card windows.
 */
export class RefCard extends Base {


    iHead: HTMLElement = document.getElementsByTagName('head')[0];
    iTitle: HTMLElement = document.getElementsByTagName('title')[0];
    iDivInsert: HTMLElement = document.getElementById('iDivInsert');

    /**
     * For the time being we will be using only one device per window.
     * However we kept support for multiple devices as we may make this a settings option.
     * TODO: Make it not game specific
     */ 
    iDevices = new Array<Device>();


    /** 
     *  Dynamic lines linking anchor points on device image to label groups 
     */
    iLines = new Array();

    constructor() {
        super();
        Log.d("Window.RefCard constructor");

        // Make sure our links are updated
        window.addEventListener('load', () => {
            console.log("page is loaded")
            this.UpdateLinksPositions();
        })


        window.addEventListener('resize', () => {
            console.log("page is resized")
            this.UpdateLinksPositions();
        })

        this.iDivInsert.addEventListener('scroll', () => {
            console.log("on scroll")
            this.UpdateLinksPositions();
        })

        // Observer changes in our insert
        const config = { attributes: true, childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            this.UpdateLinksPositions();
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(this.iDivInsert, config);

    }

   
    /**
     * Create links between controller anchor points and labels
     */
    LinkLabelsToAnchors(aId: string) {

        let options = {
            color: 'BlueViolet',
            //startPlug: 'disc',
            endPlug: 'disc',
            //path: 'grid'
            path: 'straight'
        };

        // Link all labels to anchors
        // Get our refcard content
        let content = document.getElementById(aId);
        // Get all our ref card label groups
        let lgs = content.getElementsByClassName(`label-group`);
        //console.log(lgs);  

        // For each label group in our refcard
        for (let lg of lgs) {
            //console.log(lg);
            // Workout the anchor id for this label group
            let anchorId = lg.id.replace('label-group-', 'anchor-');
            //anchorId = anchorId.replace('label-','anchor-');
            // Create our link object 
            let line = new LeaderLine(lg, content.querySelector(`#${anchorId}`), options);
            // Keep track of it
            this.iLines.push(line);
        }
    }

    /**
     * Make sure our links are updated.
     */
    UpdateLinksPositions() {
        for (const l of this.iLines) {
            l.position();
        }
    }

    /**
     */
    HideDefaultLabels() {
        this.iDevices.forEach((d) => {            
            for (const label of d.iLogicalToLabel.values()) {
                label.remove();
                //label.innerHTML = "";
                //(<HTMLElement>label).style.display = 'hidden';
            }
        });
    }

}


