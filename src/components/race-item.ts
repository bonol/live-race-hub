import Component from "./base-component";
import { Race, RaceStatus } from "../models/race";
import RacerItem from "./racer-item";

export default class RaceItem extends Component<HTMLDListElement, HTMLLIElement>{
    private race: Race;

    constructor(hostId: string, race: Race){
        super('single-race', hostId, true, race.id);
        this.race = race;

        this.configure();
        this.renderContent();
    }

    configure(): void {
        this.element.addEventListener('dblclick', this.loadRaceForEditing.bind(this));
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.race.name;
        const ulElem = this.element.querySelector('ul')! as HTMLUListElement;
        ulElem.id = ulElem.id + '-' + this.race.id;
        for(const racer of this.race.racers) {
            new RacerItem(ulElem.id, racer);
        }
    }

    private loadRaceForEditing() {
        const raceInputElement = document.getElementById('user-input')! as HTMLFormElement;
        const raceIdElement = raceInputElement.querySelector('#race-id')! as HTMLInputElement;
        const nameInputElement = raceInputElement.querySelector('#name')! as HTMLInputElement;
        const minParticipantElement = raceInputElement.querySelector('#min-racer')! as HTMLInputElement;
        const maxParticipantElement = raceInputElement.querySelector('#max-racer')! as HTMLInputElement;
        const racersListElement = raceInputElement.querySelector('#racers-list')! as HTMLDivElement;
        const raceCompletedElement = raceInputElement.querySelector('#race-completed')! as HTMLInputElement;
        const raceCompleted = this.race.status === RaceStatus.Finished;

        raceIdElement.value = this.race.id;
        nameInputElement.value = this.race.name;
        minParticipantElement.value = this.race.min.toString();
        maxParticipantElement.value = this.race.max.toString();
        racersListElement.innerHTML = '';
        raceCompletedElement.value = raceCompleted ? 'true' : 'false';
        raceCompletedElement.checked = raceCompleted;

        this.race.racers.forEach((racer, index) => {
            const racerEntryTemplate = document.getElementById('racer-entry')! as HTMLTemplateElement;
            const racerEntry = document.importNode(racerEntryTemplate.content, true);

            const racerDiv = racerEntry.firstElementChild as HTMLDivElement;
            racerDiv.id = `racer-entry-${index + 1}`;

            const racerName = racerEntry.querySelector('#racer-name-1') as HTMLInputElement;
            racerName.id = `racer-name-${index + 1}`;
            racerName.value = racer.name;

            const racerLane = racerEntry.querySelector('#racer-lane-1') as HTMLSelectElement;
            racerLane.id = `racer-lane-${index + 1}`;
            racerLane.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(lane => 
                `<option value="${lane}" ${lane === +racer.raceLane ? 'selected' : ''}>${lane}</option>`
            ).join('');

            const racerPlace = racerEntry.querySelector('#racer-place-1') as HTMLSelectElement;
            racerPlace.id = `racer-place-${index + 1}`;
            racerPlace.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(place => 
                `<option value="${place}" ${racer.racePosition !== null && racer.racePosition !== undefined && place === +racer.racePosition ? 'selected' : ''}>${place}</option>`
            ).join('');
            
            const racerPlaceDiv = racerEntry.querySelector('.racer-place-div') as HTMLDivElement;
            racerPlaceDiv.hidden = !raceCompleted;

            racersListElement.appendChild(racerEntry);
        });
    }
}