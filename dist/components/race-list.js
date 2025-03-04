import Component from "./base-component";
import { RaceStatus } from "../models/race";
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
        raceState.addListener((races) => {
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
            console.log('race list listener to render race');
            this.assignedRaces = relevantRaces;
            this.renderRaces();
        });
    }
    renderContent() {
        const listId = `${this.type}-races-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = `${this.type.toUpperCase()} Race`;
    }
    renderRaces() {
        const listElement = document.getElementById(`${this.type}-races-list`);
        listElement.innerHTML = "";
        for (const item of this.assignedRaces) {
            new RaceItem(this.element.querySelector('ul').id, item);
        }
    }
}
