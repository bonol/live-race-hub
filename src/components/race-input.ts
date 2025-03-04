import Component from "./base-component";
import { raceState } from "../state/race-state";
import { v4 as uuid } from 'uuid';

export default class RaceInput extends Component<HTMLDivElement, HTMLFormElement>{
    nameInputElement: HTMLInputElement;
    minParticipantElement: HTMLInputElement;
    maxParticipantElement: HTMLInputElement;
    racersListElement: HTMLDivElement;

    racerCount: number = 0;

    constructor(){
        super('race-input', 'app', true, 'user-input');
        this.nameInputElement = this.element.querySelector("#name")! as HTMLInputElement;
        this.minParticipantElement = this.element.querySelector("#min-racer")! as HTMLInputElement;
        this.maxParticipantElement = this.element.querySelector("#max-racer")! as HTMLInputElement;
        this.racersListElement = this.element.querySelector("#racers-list")! as HTMLDivElement;

        this.configure();
    }

    configure(): void {
        const addRacerBtn = this.element.querySelector('#add-racer');
        this.element.addEventListener("submit", this.submitHandler.bind(this));
        addRacerBtn!.addEventListener('click', this.addRacerHandler.bind(this));
    }

    renderContent(): void {}

    private gatherRaceInput(): [string, number, number, any[]] | void {
        const enteredName = this.nameInputElement.value;
        const enteredMin = this.minParticipantElement.value;
        const enteredMax = this.maxParticipantElement.value;

        //will need to gather racers later
        console.log('racerlistelement', this.racersListElement);
        const racerEntries = this.racersListElement.querySelectorAll('.racer-entry');
        console.log('racerentries', racerEntries);

        const enteredRacers = Array.from(racerEntries).map(entry => {
            const nameInput = entry.querySelector('input[name="racer-name[]"]') as HTMLInputElement;
            const laneInput = entry.querySelector('input[name="racer-lane[]"]') as HTMLInputElement;
            return {
                id: uuid().toString(),
                name: nameInput?.value || "",
                raceLane: laneInput?.value || "",
            };
        });

        return [enteredName, +enteredMin, +enteredMax, enteredRacers];
    }

    private addRacerHandler(event: Event){
        event.preventDefault();
        console.log('add racer clicked');
        const racerEntryTemplate = document.getElementById('racer-entry')! as HTMLTemplateElement;
        const racerEntry = document.importNode(racerEntryTemplate.content, true);

        this.racerCount++;
        const racerDiv = racerEntry.firstElementChild as HTMLDivElement;
        racerDiv.id = `racer-entry-${this.racerCount}`;
        const racerName = racerEntry.querySelector('#racer-name-1') as HTMLInputElement;
        racerName.id = `racer-name-${this.racerCount}`;

        this.racersListElement.appendChild(racerEntry);
    }

    private submitHandler(event: Event){
        event.preventDefault();
        console.log('submit pressed!');
        const raceInput = this.gatherRaceInput();
        if (raceInput) {
            const [name, min, max, racers] = raceInput;
            raceState.addRace(name, min, max, racers);
        }
    }

}