import Component from "./base-component";
import { Race, RaceStatus } from "../models/race";
import { raceState } from "../state/race-state";
import RaceItem from "./race-item";

export default class RaceList extends Component<HTMLDivElement, HTMLElement> {
    assignedRaces: Race[] = [];

    constructor(private type: "pending" | "ready" | "finished"){
        super("race-list", "app", false, `${type}-races`);
        this.configure();
        this.renderContent();
    }

    configure(): void {
        raceState.addListener((races: Race[]) => {
            const relevantRaces = races.filter(race => {
                if (this.type === 'pending'){
                    return race.status === RaceStatus.Pending;
                } else if (this.type === 'ready') {
                    return race.status === RaceStatus.Ready;
                } else {
                    return race.status === RaceStatus.Finished;
                }
            });
            console.log('race list listener to render race');
            this.assignedRaces = relevantRaces;
            this.renderRaces();
        });
    }

    renderContent(): void {
        const listId = `${this.type}-races-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} Race`;
    }

    private renderRaces() {
        const listElement = document.getElementById(`${this.type}-races-list`)! as HTMLDListElement;
        listElement.innerHTML = "";
        for (const item of this.assignedRaces) {
            new RaceItem(this.element.querySelector('ul')!.id, item);
        }
    }

}