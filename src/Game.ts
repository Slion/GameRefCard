import { Adapter } from "./Games/Adapter";
import { MechWarrior5 } from "./Games/MechWarrior5";
import { None } from "./Games/None";


enum Game {
    None,
    MechWarrior5
}

export const Games = new Map<string, Adapter>([
    ["None", new None()],
    ["MW5", new MechWarrior5()]
]);