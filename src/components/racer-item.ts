import Component from "./base-component";
import { Racer } from "../models/race";

export default class RacerItem extends Component<HTMLUListElement, HTMLLIElement> {
    private racer: Racer;

    get racerPlace() {
        this.racer.racePlace === null || this.racer.racePlace?.toString() === "" ? "" : `Place: ${this.racer.racePlace}`;
        return '';
    }

    constructor(hostId: string, racer: Racer){
        super('single-racer', hostId, false, racer.id);

        this.racer = racer;
        this.configure();
        this.renderContent();
    }

    configure(): void {}

    renderContent(): void {
        this.element.querySelector('h3')!.textContent = `Racer: ${this.racer.name}`;
        this.element.querySelector('#racer-lane-display')!.textContent =  `Lane: ${this.racer.raceLane}`;
        this.element.querySelector('#racer-place-display')!.textContent =  this.racerPlace;
    }
} 