import Component from "./base-component";
import { Race } from "../models/race";

export default class RaceItem extends Component<HTMLDListElement, HTMLLIElement>{
    private race: Race;

    constructor(hostId: string, race: Race){
        super('single-race', hostId, false, race.id);
        this.race = race;

        this.configure();
        this.renderContent();
    }

    configure(): void {
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.race.name;
    }
}