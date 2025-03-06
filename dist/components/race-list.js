import Component from "./base-component";
import { Race, RaceStatus } from "../models/race";
import { raceState } from "../state/race-state";
import RaceItem from "./race-item";
export default class RaceList extends Component {
    constructor(type) {
        super("race-list", "app", false, `${type}-races`);
        this.type = type;
        this.assignedRaces = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        this.loadRaces();
        raceState.addListener((races) => {
            console.log('race list listener to render race');
            this.assignedRaces = this.relevantRaces(races);
            this.renderRaces();
        });
    }
    renderContent() {
        const listId = `${this.type}-races-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = `${this.type.toUpperCase()} Race`;
        this.renderRaces();
    }
    renderRaces() {
        const listElement = document.getElementById(`${this.type}-races-list`);
        listElement.innerHTML = "";
        for (const item of this.assignedRaces) {
            new RaceItem(this.element.querySelector('ul').id, item);
        }
    }
    loadRaces() {
        const storedRaces = localStorage.getItem('races');
        console.log('storeraces', storedRaces);
        if (storedRaces !== null) {
            const parsedRaces = JSON.parse(storedRaces);
            this.assignedRaces = this.relevantRaces(parsedRaces).map((race) => new Race(race.id, race.name, race.min, race.max, race.status, race.racers, race.results));
            raceState.races = this.assignedRaces.slice();
        }
    }
    relevantRaces(races) {
        const relevantRaces = races.filter(race => {
            if (this.type === 'pending') {
                return race.status === RaceStatus.Pending;
            }
            else if (this.type === 'ready') {
                return race.status === RaceStatus.Ready;
            }
            else {
                return race.status === RaceStatus.Finished;
            }
        });
        return relevantRaces;
    }
}
