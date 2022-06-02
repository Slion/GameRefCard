import { Log } from "../Log";
import { RefCard } from "../Windows/RefCard";
import { Adapter } from "./Adapter";

/**
 * 
 */
export class None extends Adapter {

    iActionKeyMap: any;

    iRefCard: RefCard = null;

    constructor() {
        super()
        Log.d("Games.MechWarrior5 constructor");
    }


    async BuildRefCard(aRefCard: RefCard) {

        this.iRefCard = aRefCard;


    }
}
