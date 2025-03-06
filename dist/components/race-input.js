import Component from "./base-component";
import { raceState } from "../state/race-state";
import { v4 as uuid } from 'uuid';
import { Race, RaceStatus } from "../models/race";
export default class RaceInput extends Component {
    constructor() {
        super('race-input', 'app', false, 'user-input');
        this.racerCount = 0;
        this.availableLanes = [];
        this.selectedLanes = [];
        this.idInputElement = this.element.querySelector("#race-id");
        this.nameInputElement = this.element.querySelector("#name");
        this.minParticipantElement = this.element.querySelector("#min-racer");
        this.maxParticipantElement = this.element.querySelector("#max-racer");
        this.racersListElement = this.element.querySelector("#racers-list");
        this.raceCompletedElement = this.element.querySelector("#race-completed");
        this.configure();
    }
    configure() {
        this.availableLanes = Array.from({ length: +this.maxParticipantElement.value }, (_, i) => i + 1);
        const addRacerBtn = this.element.querySelector('#add-racer');
        this.element.addEventListener("submit", this.submitHandler.bind(this));
        addRacerBtn.addEventListener('click', this.addRacerHandler.bind(this));
        this.raceCompletedElement.addEventListener('click', this.toggleRaceCompleted.bind(this));
    }
    renderContent() { }
    toggleRaceCompleted() {
        this.raceCompletedElement.value = this.raceCompletedElement.value === 'true' ? 'false' : 'true';
        const racerEntries = this.racersListElement.querySelectorAll('.racer-place-div');
        for (const racerPlaceElem of racerEntries) {
            const elem = racerPlaceElem;
            elem.hidden = !elem.hidden;
        }
    }
    gatherRaceInput() {
        const raceId = this.idInputElement.value;
        const enteredName = this.nameInputElement.value;
        const enteredMin = this.minParticipantElement.value;
        const enteredMax = this.maxParticipantElement.value;
        const raceCompleted = this.raceCompletedElement.value === 'true';
        const racerEntries = this.racersListElement.querySelectorAll('.racer-entry');
        const enteredRacers = Array.from(racerEntries).map(entry => {
            const nameInput = entry.querySelector('input[name="racer-name[]"]');
            const laneInput = entry.querySelector('select[name="racer-lane[]"]');
            const positionInput = entry.querySelector('select[name="racer-place[]"]');
            return {
                id: uuid().toString(),
                name: (nameInput === null || nameInput === void 0 ? void 0 : nameInput.value) || "",
                raceLane: +(laneInput === null || laneInput === void 0 ? void 0 : laneInput.value) || "",
                racePosition: +(positionInput === null || positionInput === void 0 ? void 0 : positionInput.value) || "",
            };
        });
        return [raceId, enteredName, +enteredMin, +enteredMax, enteredRacers, raceCompleted];
    }
    addRacerHandler(event) {
        event.preventDefault();
        if (this.racerCount === +this.maxParticipantElement.value) {
            alert(`Max Racer ${this.maxParticipantElement.value}`);
            return;
        }
        const racerEntryTemplate = document.getElementById('racer-entry');
        const racerEntry = document.importNode(racerEntryTemplate.content, true);
        this.racerCount++;
        const racerDiv = racerEntry.firstElementChild;
        racerDiv.id = `racer-entry-${this.racerCount}`;
        const racerLane = racerEntry.querySelector('#racer-lane-1');
        racerLane.innerHTML = this.availableLanes.map(lane => `<option value="${lane}" ${this.selectedLanes.includes(lane) ? 'disabled' : ''}>${lane}</option>`).join('');
        racerLane.value = this.availableLanes.find(lane => !this.selectedLanes.includes(lane)).toString();
        racerLane.dataset.previousValue = racerLane.value;
        this.racersListElement.appendChild(racerEntry);
        this.selectedLanes.push(+racerLane.value);
        racerLane.addEventListener('change', (event) => this.updateAvailableLanes(event, racerLane));
    }
    submitHandler(event) {
        event.preventDefault();
        const raceInput = this.gatherRaceInput();
        if (raceInput) {
            const [id, name, min, max, racers, raceCompleted] = raceInput;
            const existRace = raceState.getRace(id);
            try{
                if (existRace) {
                    existRace.name = name;
                    existRace.min = min;
                    existRace.max = max;
                    existRace.racers = racers;
                    existRace.status = raceCompleted ? RaceStatus.Finished : RaceStatus.Ready;
                    raceState.editRace(existRace);
                    this.clearForm();
                }
                else {
                    const newRace = new Race(uuid().toString(), name, min, max, raceCompleted ? RaceStatus.Finished : RaceStatus.Ready, racers, []);
    
                        raceState.addRace(newRace);
                        this.clearForm();
    
    
                }
            } catch (error) {
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
        this.raceCompletedElement.value = 'false';
        this.raceCompletedElement.checked = false;
        this.racersListElement.innerHTML = '';
        this.selectedLanes = [];
        this.racerCount = 0;
    }
    updateAvailableLanes(event, racerLane) {
        const previousValue = +racerLane.dataset.previousValue;
        const newValue = +racerLane.value;
        if (previousValue) {
            this.selectedLanes = this.selectedLanes.filter(lane => lane !== previousValue);
        }
        this.selectedLanes.push(+newValue);
        racerLane.dataset.previousValue = newValue.toString();
        this.updateAllRacerLaneDropdowns();
    }
    updateAllRacerLaneDropdowns() {
        const racerLaneDropdowns = this.racersListElement.querySelectorAll('select[name="racer-lane[]"]');
        racerLaneDropdowns.forEach((dropdown) => {
            const selectElement = dropdown;
            const currentValue = +selectElement.value;
            console.log('currentValue: ', currentValue);
            selectElement.innerHTML = this.availableLanes.map(lane => `<option value="${lane}" ${this.selectedLanes.includes(lane) && lane !== currentValue ? 'disabled' : ''} ${lane === currentValue ? 'selected' : ''}>${lane}</option>`).join('');
        });
    }
}
