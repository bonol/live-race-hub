import Component from "./base-component";
import { Race, RaceStatus } from "../models/race";
import { raceState } from "../state/race-state";
import RaceItem from "./race-item";
import * as DataStorage from '../utils/data-storage';

export default class RaceList extends Component<HTMLUListElement, HTMLLIElement> {
    assignedRaces: Race[] = [];

    constructor(public type: "pending" | "ready" | "finished"){
        super("race-list", "app", true, `${type}-races`);
        this.configure();
        this.renderContent();
    }

    configure(): void {
        this.loadRaces();
        raceState.addListener((races: Race[]) => {
            this.assignedRaces = this.relevantRaces(races);
            this.renderRaces();
        });
    }

    renderContent(): void {
        const listId = `${this.type}-races-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} Race`;
        this.renderRaces();
    }

    private renderRaces() {
        const listElement = document.getElementById(`${this.type}-races-list`)! as HTMLDListElement;
        listElement.innerHTML = "";
        for (const item of this.assignedRaces) {
            new RaceItem(this.element.querySelector('ul')!.id, item);
        }
    }

    private loadRaces() {
        const storedRaces = DataStorage.fetchData('races');
        if (storedRaces !== null) {
            const parsedRaces: Race[] = JSON.parse(storedRaces);
            this.assignedRaces = this.relevantRaces(parsedRaces).map((race: Race) => 
                new Race(
                    race.id,
                    race.name,
                    race.min,
                    race.max,
                    race.status as RaceStatus,
                    race.racers,
                    race.results
                )
            );
            raceState.races = raceState.races.concat(this.assignedRaces.slice());
        }
    }

    private relevantRaces(races: Race[]): Race[]{
        const relevantRaces = races.filter(race => {
            if (this.type === 'pending'){
                return race.status === RaceStatus.Pending;
            } else if (this.type === 'ready') {
                return race.status === RaceStatus.Ready;
            } else {
                return race.status === RaceStatus.Finished;
            }
        });
        return relevantRaces;
    }

}