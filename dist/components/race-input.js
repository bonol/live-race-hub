import Component from "./base-component";
import { raceState } from "../state/race-state";
import { v4 as uuid } from 'uuid';
import { Race, RaceStatus } from "../models/race";
export default class RaceInput extends Component {
    constructor() {
        super('race-input', 'app', true, 'user-input');
        this.racerCount = 0;
        this.nameInputElement = this.element.querySelector("#name");
        this.minParticipantElement = this.element.querySelector("#min-racer");
        this.maxParticipantElement = this.element.querySelector("#max-racer");
        this.racersListElement = this.element.querySelector("#racers-list");
        this.configure();
    }
    configure() {
        const addRacerBtn = this.element.querySelector('#add-racer');
        this.element.addEventListener("submit", this.submitHandler.bind(this));
        addRacerBtn.addEventListener('click', this.addRacerHandler.bind(this));
    }
    renderContent() { }
    gatherRaceInput() {
        const enteredName = this.nameInputElement.value;
        const enteredMin = this.minParticipantElement.value;
        const enteredMax = this.maxParticipantElement.value;
        const racerEntries = this.racersListElement.querySelectorAll('.racer-entry');
        const enteredRacers = Array.from(racerEntries).map(entry => {
            const nameInput = entry.querySelector('input[name="racer-name[]"]');
            const laneInput = entry.querySelector('input[name="racer-lane[]"]');
            return {
                id: uuid().toString(),
                name: (nameInput === null || nameInput === void 0 ? void 0 : nameInput.value) || "",
                raceLane: (laneInput === null || laneInput === void 0 ? void 0 : laneInput.value) || "",
            };
        });
        return [enteredName, +enteredMin, +enteredMax, enteredRacers];
    }
    addRacerHandler(event) {
        event.preventDefault();
        console.log('add racer clicked');
        if (this.racerCount === +this.maxParticipantElement.value) {
            alert(`Max Racer #{+this.maxParticipantElement.value}`);
            return;
        }
        const racerEntryTemplate = document.getElementById('racer-entry');
        const racerEntry = document.importNode(racerEntryTemplate.content, true);
        this.racerCount++;
        const racerDiv = racerEntry.firstElementChild;
        racerDiv.id = `racer-entry-${this.racerCount}`;
        const racerName = racerEntry.querySelector('#racer-name-1');
        racerName.id = `racer-name-${this.racerCount}`;
        this.racersListElement.appendChild(racerEntry);
    }
    submitHandler(event) {
        event.preventDefault();
        console.log('submit pressed!');
        const raceInput = this.gatherRaceInput();
        if (raceInput) {
            const [name, min, max, racers] = raceInput;
            const newRace = new Race(uuid().toString(), name, min, max, RaceStatus.Ready, racers, []);
            try {
                raceState.addRace(newRace);
                this.clearForm();
            }
            catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                }
                else {
                    alert('Error on adding new race');
                }
            }
        }
    }
    clearForm() {
        this.nameInputElement.value = '';
        this.minParticipantElement.value = '2';
        this.maxParticipantElement.value = '8';
        this.racersListElement.innerHTML = '';
        this.racerCount = 0;
    }
}
