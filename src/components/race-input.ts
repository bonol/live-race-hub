import Component from "./base-component";
import { raceState } from "../state/race-state";
import { v4 as uuid } from 'uuid';
import { Race, RaceStatus } from "../models/race";

export default class RaceInput extends Component<HTMLDivElement, HTMLFormElement>{
    nameInputElement: HTMLInputElement;
    minParticipantElement: HTMLInputElement;
    maxParticipantElement: HTMLInputElement;
    racersListElement: HTMLDivElement;
    raceCompletedElement: HTMLInputElement;
    idInputElement: HTMLInputElement;

    racerCount: number = 0;
    availableLanes: number[] = [];
    selectedLanes: number[] = [];

    constructor(){
        super('race-input', 'app', false, 'user-input');
        this.idInputElement = this.element.querySelector("#race-id")! as HTMLInputElement;
        this.nameInputElement = this.element.querySelector("#name")! as HTMLInputElement;
        this.minParticipantElement = this.element.querySelector("#min-racer")! as HTMLInputElement;
        this.maxParticipantElement = this.element.querySelector("#max-racer")! as HTMLInputElement;
        this.racersListElement = this.element.querySelector("#racers-list")! as HTMLDivElement;
        this.raceCompletedElement = this.element.querySelector("#race-completed")! as HTMLInputElement;

        this.configure();
    }

    configure(): void {
        this.availableLanes = Array.from({length: +this.maxParticipantElement.value}, (_, i) => i+1);
        const addRacerBtn = this.element.querySelector('#add-racer');
        this.element.addEventListener("submit", this.submitHandler.bind(this));
        addRacerBtn!.addEventListener('click', this.addRacerHandler.bind(this));
        this.raceCompletedElement.addEventListener('click', this.toggleRaceCompleted.bind(this));
    }

    renderContent(): void {}

    private toggleRaceCompleted(){
        this.raceCompletedElement.value = this.raceCompletedElement.value === 'true' ? 'false' : 'true';
        const racerEntries = this.racersListElement.querySelectorAll('.racer-place-div');
        for(const racerPlaceElem of racerEntries) {
            const elem = racerPlaceElem as HTMLInputElement;
            elem.hidden = !elem.hidden;
        }
    }

    private gatherRaceInput(): [string, string, number, number, any[], string] | void {
        const raceId = this.idInputElement.value;
        const enteredName = this.nameInputElement.value;
        const enteredMin = this.minParticipantElement.value;
        const enteredMax = this.maxParticipantElement.value;
        const raceCompleted = this.raceCompletedElement.value;

        //will need to gather racers later
        const racerEntries = this.racersListElement.querySelectorAll('.racer-entry');
        const enteredRacers = Array.from(racerEntries).map(entry => {
            const nameInput = entry.querySelector('input[name="racer-name[]"]') as HTMLInputElement;
            const laneInput = entry.querySelector('select[name="racer-lane[]"]') as HTMLSelectElement;
            return {
                id: uuid().toString(),
                name: nameInput?.value || "",
                raceLane: laneInput?.value || "",
            };
        });

        return [raceId, enteredName, +enteredMin, +enteredMax, enteredRacers, raceCompleted];
    }

    private addRacerHandler(event: Event){
        event.preventDefault();
        if(this.racerCount === +this.maxParticipantElement.value){
            alert(`Max Racer ${this.maxParticipantElement.value}`);
            return;
        }

        const racerEntryTemplate = document.getElementById('racer-entry')! as HTMLTemplateElement;
        const racerEntry = document.importNode(racerEntryTemplate.content, true);

        this.racerCount++;
        const racerDiv = racerEntry.firstElementChild as HTMLDivElement;
        racerDiv.id = `racer-entry-${this.racerCount}`;

        const racerLane = racerEntry.querySelector('#racer-lane-1')! as HTMLSelectElement;
        racerLane.innerHTML = this.availableLanes.map(lane => 
            `<option value="${lane}" ${this.selectedLanes.includes(lane) ? 'disabled' : ''}>${lane}</option>`
        ).join('');

        racerLane.value = this.availableLanes.find(lane => !this.selectedLanes.includes(lane))!.toString();
        racerLane.dataset.previousValue = racerLane.value;

        this.racersListElement.appendChild(racerEntry);

        //remove the default lane from lanes list
        this.selectedLanes.push(+racerLane.value);
        //Add listener to update available lanes when lane value changes
        racerLane.addEventListener('change', (event) => this.updateAvailableLanes(event, racerLane));
    }

    private submitHandler(event: Event){
        event.preventDefault();
        const raceInput = this.gatherRaceInput();
        if (raceInput) {
            const [id, name, min, max, racers, raceCompleted] = raceInput;
            const existRace: Race | undefined = raceState.getRace(id);
            console.log(`race id: ${id} and exist race ${existRace}`);
    
            if(existRace){
                existRace.name = name;
                existRace.min = min;
                existRace.max = max;
                existRace.racers = racers;
                existRace.status = raceCompleted == 'true' ? RaceStatus.Finished : RaceStatus.Ready;

                raceState.editRace(existRace);
                this.clearForm();
            } else {
                const newRace = new Race(
                    uuid().toString(),
                    name,
                    min,
                    max,
                    raceCompleted == 'true' ? RaceStatus.Finished : RaceStatus.Ready,
                    racers,
                    []
                );
                try{
                    raceState.addRace(newRace);
                    this.clearForm();
                } catch (error) {
                    if (error instanceof Error){
                        alert(error.message);
                    } else {
                        alert('Error on adding new race');
                    }
                }            
            }

        }
    }

    private clearForm(){
        this.nameInputElement.value = '';
        this.minParticipantElement.value = '2';
        this.maxParticipantElement.value = '8';
        this.raceCompletedElement.value = 'false';
        this.raceCompletedElement.checked = false;
        this.racersListElement.innerHTML = '';
        this.selectedLanes = [];
        this.racerCount = 0;
    }

    private updateAvailableLanes(event: Event, racerLane: HTMLSelectElement){
        const previousValue = +racerLane.dataset.previousValue!;
        const newValue = +racerLane.value;

        if(previousValue){
            this.selectedLanes = this.selectedLanes.filter(lane => lane !== previousValue);
        }
        this.selectedLanes.push(+newValue);
        racerLane.dataset.previousValue = newValue.toString();
        this.updateAllRacerLaneDropdowns();
    }

    private updateAllRacerLaneDropdowns() {
        const racerLaneDropdowns = this.racersListElement.querySelectorAll('select[name="racer-lane[]"]');
        racerLaneDropdowns.forEach((dropdown) => {
            const selectElement = dropdown as HTMLSelectElement;
            const currentValue = +selectElement.value;
            console.log('currentValue: ', currentValue);
            selectElement.innerHTML = this.availableLanes.map(lane => 
                `<option value="${lane}" ${this.selectedLanes.includes(lane) && lane !== currentValue ? 'disabled' : ''} ${lane === currentValue ? 'selected' : ''}>${lane}</option>`
            ).join('');
        });
    }

}